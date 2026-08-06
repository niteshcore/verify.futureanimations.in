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
    # No-op: qr_code_data is generated in-memory, not stored in DB
    pass


def downgrade():
    pass
