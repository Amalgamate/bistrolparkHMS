import psycopg2
from psycopg2 import sql
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import logging
import time
from datetime import datetime
import sys
from collections import defaultdict

# Configure logging
logging.basicConfig(
    filename='migration.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Add console handler to see logs in terminal
console = logging.StreamHandler()
console.setLevel(logging.INFO)
formatter = logging.Formatter('%(levelname)s - %(message)s')
console.setFormatter(formatter)
logging.getLogger('').addHandler(console)

# Configuration
SOURCE_DB_NAME = "bristol_park_legacy"  # Your source database name (from the screenshot)
TARGET_DB_NAME = "bristol_park_hmis"    # Your target database name
DB_USER = "postgres"
DB_PASSWORD = "password"
DB_HOST = "localhost"
DB_PORT = "5432"

# Global variables for tracking progress
TOTAL_TABLES = 0
MIGRATED_TABLES = 0
TOTAL_ROWS = 0
MIGRATED_ROWS = 0
START_TIME = None
TABLE_DEPENDENCIES = defaultdict(list)  # To track table dependencies

def print_progress_bar(iteration, total, prefix='', suffix='', length=50, fill='█'):
    """Print a progress bar to the console"""
    percent = ("{0:.1f}").format(100 * (iteration / float(total)))
    filled_length = int(length * iteration // total)
    bar = fill * filled_length + '-' * (length - filled_length)
    sys.stdout.write(f'\r{prefix} |{bar}| {percent}% {suffix}')
    sys.stdout.flush()
    if iteration == total:
        sys.stdout.write('\n')
        sys.stdout.flush()

def format_time(seconds):
    """Format time in seconds to a readable string"""
    if seconds < 60:
        return f"{seconds:.1f}s"
    elif seconds < 3600:
        minutes = seconds // 60
        seconds %= 60
        return f"{int(minutes)}m {int(seconds)}s"
    else:
        hours = seconds // 3600
        seconds %= 3600
        minutes = seconds // 60
        seconds %= 60
        return f"{int(hours)}h {int(minutes)}m {int(seconds)}s"

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
        logging.info(f"Successfully connected to database: {db_name}")
        return conn
    except psycopg2.Error as e:
        logging.error(f"Error connecting to database {db_name}: {e}")
        return None

def create_target_db_if_not_exists():
    """Create the target database if it doesn't exist"""
    try:
        # Connect to default postgres database
        logging.info("Connecting to postgres database to check if target database exists...")
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
            logging.info(f"Creating database {TARGET_DB_NAME}...")
            cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(TARGET_DB_NAME)))
            logging.info(f"✅ Database {TARGET_DB_NAME} created successfully.")
        else:
            logging.info(f"✅ Database {TARGET_DB_NAME} already exists.")

        cursor.close()
        conn.close()
        return True
    except psycopg2.Error as e:
        logging.error(f"❌ Error creating database: {e}")
        return False

def create_uuid_extension():
    """Create the UUID extension in the target database"""
    conn = connect_to_db(TARGET_DB_NAME)
    if not conn:
        return False

    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()

    try:
        logging.info("Creating UUID extension...")
        cursor.execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";")
        logging.info("✅ UUID extension created successfully.")
        cursor.close()
        conn.close()
        return True
    except psycopg2.Error as e:
        logging.error(f"❌ Error creating UUID extension: {e}")
        cursor.close()
        conn.close()
        return False

def get_table_schema(conn, table_name):
    """Get the schema definition for a table"""
    cursor = conn.cursor()

    try:
        logging.info(f"Analyzing schema for table: {table_name}")

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
        logging.info(f"Found {len(columns)} columns in table {table_name}")

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
        if primary_keys:
            logging.info(f"Primary key(s) found: {', '.join(primary_keys)}")
        else:
            logging.warning(f"No primary key found for table {table_name}")

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

        # Update global dependency tracking
        global TABLE_DEPENDENCIES
        for fk in foreign_keys:
            column_name, foreign_table, foreign_column = fk
            TABLE_DEPENDENCIES[table_name].append(foreign_table)
            logging.info(f"Foreign key: {table_name}.{column_name} -> {foreign_table}.{foreign_column}")

        cursor.close()
        return {
            'columns': columns,
            'primary_keys': primary_keys,
            'foreign_keys': foreign_keys
        }
    except psycopg2.Error as e:
        logging.error(f"❌ Error getting schema for table {table_name}: {e}")
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

    logging.info(f"Generated CREATE TABLE SQL for {table_name} with {len(columns_sql)} columns and {len(fk_constraints)} foreign keys")
    return create_table_sql, fk_constraints

def get_table_data(conn, table_name):
    """Get all data from a table"""
    cursor = conn.cursor()

    try:
        # First, count the rows
        cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
        row_count = cursor.fetchone()[0]
        logging.info(f"Table {table_name} contains {row_count} rows")

        # Update global row count
        global TOTAL_ROWS
        TOTAL_ROWS += row_count

        # Get the data in batches if there are many rows
        batch_size = 1000
        if row_count > batch_size:
            logging.info(f"Fetching data in batches of {batch_size} rows")

        cursor.execute(f"SELECT * FROM {table_name}")

        # Get column names
        column_names = [desc[0] for desc in cursor.description]

        # Fetch all rows
        rows = cursor.fetchall()

        cursor.close()
        return {
            'column_names': column_names,
            'rows': rows,
            'row_count': row_count
        }
    except psycopg2.Error as e:
        logging.error(f"❌ Error getting data from table {table_name}: {e}")
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
        logging.info(f"Creating table {table_name}...")
        cursor.execute(create_sql)

        # Check if table was created successfully
        cursor.execute("""
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = %s
        """, (table_name,))

        if cursor.fetchone():
            logging.info(f"✅ Table {table_name} created successfully.")
        else:
            logging.error(f"❌ Failed to create table {table_name}.")
            cursor.close()
            conn.close()
            return False

        # Add foreign key constraints
        for fk_sql in fk_constraints:
            try:
                cursor.execute(fk_sql)
            except psycopg2.Error as e:
                logging.warning(f"⚠️ Could not create foreign key constraint: {e}")
                logging.warning(f"SQL: {fk_sql}")

        cursor.close()
        conn.close()
        return True
    except psycopg2.Error as e:
        logging.error(f"❌ Error creating table {table_name}: {e}")
        logging.error(f"SQL: {create_sql}")
        cursor.close()
        conn.close()
        return False

def insert_data_into_target_db(table_name, column_names, rows):
    """Insert data into a table in the target database"""
    if not rows:
        logging.info(f"No data to insert into {table_name}.")
        return True

    conn = connect_to_db(TARGET_DB_NAME)
    if not conn:
        return False

    cursor = conn.cursor()

    try:
        row_count = len(rows)
        logging.info(f"Inserting {row_count} rows into {table_name}...")

        # Create placeholders for the INSERT statement
        placeholders = ', '.join(['%s'] * len(column_names))
        columns = ', '.join(column_names)

        # Prepare the INSERT statement
        insert_sql = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"

        # Execute the INSERT statement in batches to show progress
        batch_size = 1000
        total_batches = (row_count + batch_size - 1) // batch_size  # Ceiling division

        for i in range(0, row_count, batch_size):
            batch = rows[i:i+batch_size]
            cursor.executemany(insert_sql, batch)

            # Update progress
            batch_num = i // batch_size + 1
            progress_pct = min(100, int(100 * batch_num / total_batches))

            # Update global migrated rows count
            global MIGRATED_ROWS
            MIGRATED_ROWS += len(batch)

            # Show progress bar
            if total_batches > 1:
                print_progress_bar(
                    batch_num,
                    total_batches,
                    prefix=f'Inserting {table_name} data:',
                    suffix=f'Batch {batch_num}/{total_batches} ({progress_pct}%)'
                )

        conn.commit()
        logging.info(f"✅ Successfully inserted {row_count} rows into {table_name}.")

        # Verify row count
        cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
        actual_count = cursor.fetchone()[0]
        if actual_count == row_count:
            logging.info(f"✅ Row count verification successful: {actual_count} rows in {table_name}")
        else:
            logging.warning(f"⚠️ Row count mismatch in {table_name}: Expected {row_count}, found {actual_count}")

        cursor.close()
        conn.close()
        return True
    except psycopg2.Error as e:
        logging.error(f"❌ Error inserting data into {table_name}: {e}")
        conn.rollback()
        cursor.close()
        conn.close()
        return False

def migrate_table(source_conn, table_name):
    """Migrate a table from source to target database"""
    global MIGRATED_TABLES

    logging.info(f"\n{'='*50}")
    logging.info(f"MIGRATING TABLE: {table_name}")
    logging.info(f"{'='*50}")

    table_start_time = time.time()

    # Get the table schema
    schema = get_table_schema(source_conn, table_name)
    if not schema:
        logging.error(f"❌ Failed to get schema for {table_name}. Skipping.")
        return False

    # Generate CREATE TABLE SQL
    create_sql, fk_constraints = generate_create_table_sql(table_name, schema)

    # Create the table in the target database
    if not create_table_in_target_db(table_name, create_sql, fk_constraints):
        logging.error(f"❌ Failed to create table {table_name}. Skipping data migration.")
        return False

    # Get the table data
    data = get_table_data(source_conn, table_name)
    if not data:
        logging.error(f"❌ Failed to get data for {table_name}. Skipping data migration.")
        return False

    # Insert the data into the target database
    if not insert_data_into_target_db(table_name, data['column_names'], data['rows']):
        logging.error(f"❌ Failed to insert data into {table_name}.")
        return False

    # Update migrated tables count
    MIGRATED_TABLES += 1

    # Calculate and log elapsed time
    elapsed_time = time.time() - table_start_time
    logging.info(f"✅ Successfully migrated table {table_name} in {format_time(elapsed_time)}")

    # Show overall progress
    if TOTAL_TABLES > 0:
        progress_pct = min(100, int(100 * MIGRATED_TABLES / TOTAL_TABLES))
        logging.info(f"Overall progress: {MIGRATED_TABLES}/{TOTAL_TABLES} tables ({progress_pct}%)")

    return True

def list_tables(conn):
    """List all tables in the database"""
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE'
            ORDER BY table_name
        """)

        tables = [row[0] for row in cursor.fetchall()]
        logging.info(f"Found {len(tables)} tables in the database")
        cursor.close()
        return tables
    except psycopg2.Error as e:
        logging.error(f"❌ Error listing tables: {e}")
        cursor.close()
        return []

def list_columns(conn, table_name):
    """List all columns in a table"""
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = %s
            ORDER BY ordinal_position
        """, (table_name,))

        columns = [(row[0], row[1]) for row in cursor.fetchall()]
        cursor.close()
        return columns
    except psycopg2.Error as e:
        logging.error(f"❌ Error listing columns for table {table_name}: {e}")
        cursor.close()
        return []

def sort_tables_by_dependencies(tables, dependencies):
    """Sort tables based on their dependencies to ensure proper migration order"""
    # Create a directed graph
    graph = defaultdict(list)
    for table, deps in dependencies.items():
        for dep in deps:
            if dep in tables and table in tables:
                graph[dep].append(table)

    # Perform topological sort
    visited = set()
    temp_visited = set()
    result = []

    def visit(node):
        if node in temp_visited:
            # Circular dependency detected
            return
        if node in visited:
            return

        temp_visited.add(node)
        for neighbor in graph.get(node, []):
            visit(neighbor)

        temp_visited.remove(node)
        visited.add(node)
        result.append(node)

    # Visit all nodes
    for table in tables:
        if table not in visited:
            visit(table)

    # Reverse to get correct order (dependencies first)
    return result

def find_patient_related_tables(conn):
    """Find tables that are likely related to patients"""
    logging.info("Searching for patient-related tables...")
    patient_tables = []

    # Get all tables
    tables = list_tables(conn)

    # Check each table for patient-related columns or names
    for table in tables:
        is_patient_related = False

        # Check if table name contains patient-related keywords
        patient_keywords = ['patient', 'person', 'client', 'member', 'customer', 'admission', 'visit']
        if any(keyword in table.lower() for keyword in patient_keywords):
            is_patient_related = True
            logging.info(f"Found patient-related table by name: {table}")

        # Check if table has columns with patient-related names
        if not is_patient_related:
            columns = list_columns(conn, table)
            column_names = [col[0].lower() for col in columns]

            patient_column_keywords = ['patient_id', 'person_id', 'client_id', 'member_id', 'customer_id', 'admission_id', 'visit_id']
            if any(col in column_names for col in patient_column_keywords):
                is_patient_related = True
                logging.info(f"Found patient-related table by column: {table}")

        if is_patient_related and table not in patient_tables:
            patient_tables.append(table)

    # Also include payment and financial tables
    financial_keywords = ['payment', 'invoice', 'bill', 'charge', 'fee', 'transaction', 'receipt', 'finance']
    for table in tables:
        if any(keyword in table.lower() for keyword in financial_keywords):
            if table not in patient_tables:
                patient_tables.append(table)
                logging.info(f"Found financial table: {table}")

    # Also include medical-related tables
    medical_keywords = ['diagnosis', 'prescription', 'medication', 'lab', 'test', 'result', 'vitals', 'treatment']
    for table in tables:
        if any(keyword in table.lower() for keyword in medical_keywords):
            if table not in patient_tables:
                patient_tables.append(table)
                logging.info(f"Found medical table: {table}")

    logging.info(f"Found {len(patient_tables)} patient-related tables")
    return patient_tables

def main():
    """Main function to migrate patient-related tables"""
    # Initialize global variables
    global TOTAL_TABLES, MIGRATED_TABLES, TOTAL_ROWS, MIGRATED_ROWS, START_TIME, TABLE_DEPENDENCIES

    START_TIME = time.time()

    logging.info(f"{'='*80}")
    logging.info(f"STARTING DATABASE MIGRATION: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logging.info(f"{'='*80}")
    logging.info(f"Source database: {SOURCE_DB_NAME}")
    logging.info(f"Target database: {TARGET_DB_NAME}")

    # Step 1: Create the target database if it doesn't exist
    if not create_target_db_if_not_exists():
        logging.error("❌ Failed to create target database. Aborting.")
        return

    # Step 2: Create the UUID extension
    if not create_uuid_extension():
        logging.error("❌ Failed to create UUID extension. Aborting.")
        return

    # Step 3: Connect to the source database
    source_conn = connect_to_db(SOURCE_DB_NAME)
    if not source_conn:
        logging.error("❌ Failed to connect to source database. Aborting.")
        return

    # Step 4: List all tables in the source database
    all_tables = list_tables(source_conn)
    logging.info("\nAll tables in the source database:")
    for i, table in enumerate(all_tables, 1):
        logging.info(f"{i}. {table}")

    # Step 5: Find patient-related tables
    patient_tables = find_patient_related_tables(source_conn)
    logging.info("\nPatient-related tables found:")
    for i, table in enumerate(patient_tables, 1):
        logging.info(f"{i}. {table}")

    # Step 6: Prepare tables for migration
    if not patient_tables:
        logging.warning("\n⚠️ No patient-related tables found. Trying common table names.")
        # Try some common table names
        patient_tables = [table for table in all_tables if table.lower() in [
            'patients', 'patient', 'persons', 'person', 'clients', 'client',
            'payments', 'payment', 'invoices', 'invoice', 'bills', 'bill',
            'charges', 'charge', 'fees', 'fee', 'transactions', 'transaction'
        ]]

    if not patient_tables:
        logging.warning("\n⚠️ No patient-related tables found. Using first few tables as fallback.")
        # Just migrate the first few tables as a fallback
        patient_tables = all_tables[:5] if len(all_tables) >= 5 else all_tables

    # Step 7: Sort tables by dependencies to ensure proper migration order
    # First, analyze all tables to build dependency graph
    for table in patient_tables:
        get_table_schema(source_conn, table)

    # Sort tables based on dependencies
    sorted_tables = sort_tables_by_dependencies(patient_tables, TABLE_DEPENDENCIES)

    logging.info(f"\nTables will be migrated in the following order:")
    for i, table in enumerate(sorted_tables, 1):
        logging.info(f"{i}. {table}")

    # Set total tables count for progress tracking
    TOTAL_TABLES = len(sorted_tables)

    # Step 8: Migrate tables in the correct order
    for table_name in sorted_tables:
        # Show columns before migration
        columns = list_columns(source_conn, table_name)
        logging.info(f"\nColumns in table {table_name}:")
        for col_name, col_type in columns:
            logging.info(f"  - {col_name} ({col_type})")

        # Migrate the table
        migrate_table(source_conn, table_name)

    # Close the source connection
    source_conn.close()

    # Calculate and log total elapsed time
    total_elapsed_time = time.time() - START_TIME

    logging.info(f"\n{'='*80}")
    logging.info(f"MIGRATION COMPLETED: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logging.info(f"{'='*80}")
    logging.info(f"Total time: {format_time(total_elapsed_time)}")
    logging.info(f"Tables migrated: {MIGRATED_TABLES}/{TOTAL_TABLES}")
    logging.info(f"Rows migrated: {MIGRATED_ROWS}")
    logging.info(f"Average speed: {MIGRATED_ROWS/total_elapsed_time:.1f} rows/second")

    # Print summary to console
    print(f"\n{'='*50}")
    print(f"MIGRATION SUMMARY")
    print(f"{'='*50}")
    print(f"✅ Tables migrated: {MIGRATED_TABLES}/{TOTAL_TABLES}")
    print(f"✅ Rows migrated: {MIGRATED_ROWS}")
    print(f"⏱️ Total time: {format_time(total_elapsed_time)}")
    print(f"⚡ Average speed: {MIGRATED_ROWS/total_elapsed_time:.1f} rows/second")
    print(f"📝 Log file: migration.log")
    print(f"{'='*50}")

if __name__ == "__main__":
    main()
