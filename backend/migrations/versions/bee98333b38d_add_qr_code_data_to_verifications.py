"""add qr_code_data to verifications

Revision ID: bee98333b38d
Revises: 
Create Date: 2026-08-06 20:34:54.240304

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bee98333b38d'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Add qr_code_data column to store QR as base64 data URI in the database
    # This avoids filesystem dependency on ephemeral cloud platforms like Render
    with op.batch_alter_table('verifications', schema=None) as batch_op:
        batch_op.add_column(sa.Column('qr_code_data', sa.Text(), nullable=True))


def downgrade():
    with op.batch_alter_table('verifications', schema=None) as batch_op:
        batch_op.drop_column('qr_code_data')
