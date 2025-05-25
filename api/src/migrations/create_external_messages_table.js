import db from '../utils/db.js';
import { fileURLToPath } from 'url';

/**
 * Create external_messages table for storing messages from external sources like tawk.to
 */
export const createExternalMessagesTable = async () => {
  try {
    // Check if table already exists
    const tableExists = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'external_messages'
      );
    `);

    if (tableExists.rows[0].exists) {
      console.log('external_messages table already exists');
      return;
    }

    // Create the table
    await db.query(`
      CREATE TABLE external_messages (
        id UUID PRIMARY KEY,
        external_chat_id VARCHAR(255) NOT NULL,
        external_user_id VARCHAR(255) NOT NULL,
        sender_name VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        source VARCHAR(50) NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        status VARCHAR(20) DEFAULT 'unread',
        assigned_to UUID,
        response_message_id UUID,
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX idx_external_messages_chat_id ON external_messages(external_chat_id);
      CREATE INDEX idx_external_messages_user_id ON external_messages(external_user_id);
      CREATE INDEX idx_external_messages_status ON external_messages(status);
      CREATE INDEX idx_external_messages_source ON external_messages(source);
    `);

    console.log('external_messages table created successfully');
  } catch (error) {
    console.error('Error creating external_messages table:', error);
    throw error;
  }
};

// Run the migration if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createExternalMessagesTable()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
