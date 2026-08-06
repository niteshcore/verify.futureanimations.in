"""no-op: qr_code_data column removed from model, stored in memory only

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
    # qr_code_data is no longer stored in the database.
    # QR codes are generated in-memory and returned directly in the API response.
    # This migration is intentionally a no-op.
    pass


def downgrade():
    pass
