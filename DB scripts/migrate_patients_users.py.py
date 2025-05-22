import os
import psycopg2
from psycopg2 import sql
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Configuration
SOURCE_DB_NAME = "bristol_park_legacy"  # Your source database name (from the screenshot)
TARGET_DB_NAME = "bristol_park_hmis"    # Your target database name
DB_USER = "postgres"
DB_PASSWORD = "password"
DB_HOST = "localhost"
DB_PORT = "5432"

def connect_to_db(db_name):
    """Connect to the specified database"""
    try:
        conn = psycopg2.connect(
            dbname=db_name,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT
        )
        return conn
    except psycopg2.Error as e:
        print(f"Error connecting to database {db_name}: {e}")
        return None

def create_target_db_if_not_exists():
    """Create the target database if it doesn't exist"""
    try:
        # Connect to default postgres database
        conn = psycopg2.connect(
            dbname="postgres",
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (TARGET_DB_NAME,))
        exists = cursor.fetchone()
        
        if not exists:
            print(f"Creating database {TARGET_DB_NAME}...")
            cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(TARGET_DB_NAME)))
            print(f"Database {TARGET_DB_NAME} created.")
        else:
            print(f"Database {TARGET_DB_NAME} already exists.")
        
        cursor.close()
        conn.close()
        return True
    except psycopg2.Error as e:
        print(f"Error creating database: {e}")
        return False

def create_uuid_extension():
    """Create the UUID extension in the target database"""
    conn = connect_to_db(TARGET_DB_NAME)
    if not conn:
        return False
    
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    
    try:
        print("Creating UUID extension...")
        cursor.execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";")
        print("UUID extension created.")
        cursor.close()
        conn.close()
        return True
    except psycopg2.Error as e:
        print(f"Error creating UUID extension: {e}")
        cursor.close()
        conn.close()
        return False

def get_table_schema(conn, table_name):
    """Get the schema definition for a table"""
    cursor = conn.cursor()
    
    try:
        # Get column definitions
        cursor.execute("""
            SELECT 
                column_name, 
                data_type, 
                character_maximum_length,
                numeric_precision,
                numeric_scale,
                is_nullable,
                column_default
            FROM 
                information_schema.columns 
            WHERE 
                table_schema = 'public' 
                AND table_name = %s
            ORDER BY 
                ordinal_position
        """, (table_name,))
        
        columns = cursor.fetchall()
        
        # Get primary key
        cursor.execute("""
            SELECT 
                kcu.column_name
            FROM 
                information_schema.table_constraints tc
            JOIN 
                information_schema.key_column_usage kcu
                ON tc.constraint_name = kcu.constraint_name
                AND tc.table_schema = kcu.table_schema
            WHERE 
                tc.constraint_type = 'PRIMARY KEY'
                AND tc.table_schema = 'public'
                AND tc.table_name = %s
        """, (table_name,))
        
        primary_keys = [row[0] for row in cursor.fetchall()]
        
        # Get foreign keys
        cursor.execute("""
            SELECT 
                kcu.column_name,
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name
            FROM 
                information_schema.table_constraints tc
            JOIN 
                information_schema.key_column_usage kcu
                ON tc.constraint_name = kcu.constraint_name
                AND tc.table_schema = kcu.table_schema
            JOIN 
                information_schema.constraint_column_usage ccu
                ON tc.constraint_name = ccu.constraint_name
                AND tc.table_schema = ccu.table_schema
            WHERE 
                tc.constraint_type = 'FOREIGN KEY'
                AND tc.table_schema = 'public'
                AND tc.table_name = %s
        """, (table_name,))
        
        foreign_keys = cursor.fetchall()
        
        cursor.close()
        return {
            'columns': columns,
            'primary_keys': primary_keys,
            'foreign_keys': foreign_keys
        }
    except psycopg2.Error as e:
        print(f"Error getting schema for table {table_name}: {e}")
        cursor.close()
        return None

def generate_create_table_sql(table_name, schema):
    """Generate SQL to create a table based on its schema"""
    columns_sql = []
    
    for column in schema['columns']:
        column_name, data_type, char_max_length, num_precision, num_scale, is_nullable, default = column
        
        # Build column type
        if char_max_length is not None:
            column_type = f"{data_type}({char_max_length})"
        elif data_type == 'numeric' and num_precision is not None and num_scale is not None:
            column_type = f"{data_type}({num_precision},{num_scale})"
        else:
            column_type = data_type
        
        # Build column definition
        column_def = f"{column_name} {column_type}"
        
        if column_name in schema['primary_keys']:
            column_def += " PRIMARY KEY"
        
        if is_nullable == 'NO':
            column_def += " NOT NULL"
        
        if default is not None:
            column_def += f" DEFAULT {default}"
        
        columns_sql.append(column_def)
    
    # Create the table SQL
    create_table_sql = f"CREATE TABLE IF NOT EXISTS {table_name} (\n    "
    create_table_sql += ",\n    ".join(columns_sql)
    create_table_sql += "\n);"
    
    # Generate foreign key constraints
    fk_constraints = []
    for fk in schema['foreign_keys']:
        column_name, foreign_table, foreign_column = fk
        fk_sql = f"ALTER TABLE {table_name} ADD CONSTRAINT fk_{table_name}_{column_name} "
        fk_sql += f"FOREIGN KEY ({column_name}) REFERENCES {foreign_table}({foreign_column});"
        fk_constraints.append(fk_sql)
    
    return create_table_sql, fk_constraints

def get_table_data(conn, table_name):
    """Get all data from a table"""
    cursor = conn.cursor()
    
    try:
        cursor.execute(f"SELECT * FROM {table_name}")
        rows = cursor.fetchall()
        
        # Get column names
        column_names = [desc[0] for desc in cursor.description]
        
        cursor.close()
        return {
            'column_names': column_names,
            'rows': rows
        }
    except psycopg2.Error as e:
        print(f"Error getting data from table {table_name}: {e}")
        cursor.close()
        return None

def create_table_in_target_db(table_name, create_sql, fk_constraints):
    """Create a table in the target database"""
    conn = connect_to_db(TARGET_DB_NAME)
    if not conn:
        return False
    
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    
    try:
        print(f"Creating table {table_name}...")
        cursor.execute(create_sql)
        
        for fk_sql in fk_constraints:
            try:
                cursor.execute(fk_sql)
            except psycopg2.Error as e:
                print(f"Warning: Could not create foreign key constraint: {e}")
                print(f"SQL: {fk_sql}")
        
        print(f"Table {table_name} created.")
        cursor.close()
        conn.close()
        return True
    except psycopg2.Error as e:
        print(f"Error creating table {table_name}: {e}")
        print(f"SQL: {create_sql}")
        cursor.close()
        conn.close()
        return False

def insert_data_into_target_db(table_name, column_names, rows):
    """Insert data into a table in the target database"""
    if not rows:
        print(f"No data to insert into {table_name}.")
        return True
    
    conn = connect_to_db(TARGET_DB_NAME)
    if not conn:
        return False
    
    cursor = conn.cursor()
    
    try:
        print(f"Inserting {len(rows)} rows into {table_name}...")
        
        # Create placeholders for the INSERT statement
        placeholders = ', '.join(['%s'] * len(column_names))
        columns = ', '.join(column_names)
        
        # Prepare the INSERT statement
        insert_sql = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
        
        # Execute the INSERT statement for each row
        cursor.executemany(insert_sql, rows)
        
        conn.commit()
        print(f"Data inserted into {table_name}.")
        cursor.close()
        conn.close()
        return True
    except psycopg2.Error as e:
        print(f"Error inserting data into {table_name}: {e}")
        conn.rollback()
        cursor.close()
        conn.close()
        return False

def migrate_table(source_conn, table_name):
    """Migrate a table from source to target database"""
    print(f"\n=== Migrating table: {table_name} ===")
    
    # Get the table schema
    schema = get_table_schema(source_conn, table_name)
    if not schema:
        print(f"Failed to get schema for {table_name}. Skipping.")
        return False
    
    # Generate CREATE TABLE SQL
    create_sql, fk_constraints = generate_create_table_sql(table_name, schema)
    
    # Create the table in the target database
    if not create_table_in_target_db(table_name, create_sql, fk_constraints):
        print(f"Failed to create table {table_name}. Skipping data migration.")
        return False
    
    # Get the table data
    data = get_table_data(source_conn, table_name)
    if not data:
        print(f"Failed to get data for {table_name}. Skipping data migration.")
        return False
    
    # Insert the data into the target database
    if not insert_data_into_target_db(table_name, data['column_names'], data['rows']):
        print(f"Failed to insert data into {table_name}.")
        return False
    
    print(f"Successfully migrated table {table_name}.")
    return True

def main():
    """Main function to migrate patients and users tables"""
    print("Starting migration of patients and users tables...")
    
    # Step 1: Create the target database if it doesn't exist
    if not create_target_db_if_not_exists():
        print("Failed to create target database. Aborting.")
        return
    
    # Step 2: Create the UUID extension
    if not create_uuid_extension():
        print("Failed to create UUID extension. Aborting.")
        return
    
    # Step 3: Connect to the source database
    source_conn = connect_to_db(SOURCE_DB_NAME)
    if not source_conn:
        print("Failed to connect to source database. Aborting.")
        return
    
    # Step 4: Migrate the users table first (since patients might reference users)
    migrate_table(source_conn, "users")
    
    # Step 5: Migrate the patients table
    migrate_table(source_conn, "patients")
    
    # Close the source connection
    source_conn.close()
    
    print("\nMigration of patients and users tables completed.")

if __name__ == "__main__":
    main()