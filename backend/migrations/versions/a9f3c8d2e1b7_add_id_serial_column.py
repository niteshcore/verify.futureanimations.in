"""no-op: id column removed from model, certificate_id derived from token hash

Revision ID: a9f3c8d2e1b7
Revises: 62c646111ece
Create Date: 2026-08-06 18:15:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = 'a9f3c8d2e1b7'
down_revision = '62c646111ece'
branch_labels = None
depends_on = None


def upgrade():
    # No-op: id column no longer exists in the model.
    # certificate_id is derived from verification_token via SHA-256 hash.
    pass


def downgrade():
    pass
