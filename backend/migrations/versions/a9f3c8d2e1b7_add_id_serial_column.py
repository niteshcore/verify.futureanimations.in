"""add id serial column to verifications table (new revision)

Revision ID: a9f3c8d2e1b7
Revises: 62c646111ece
Create Date: 2026-08-06 18:15:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a9f3c8d2e1b7'
down_revision = '62c646111ece'
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    if bind.dialect.name == 'postgresql':
        # Safe: ADD COLUMN IF NOT EXISTS preserves all existing rows.
        # PostgreSQL SERIAL auto-assigns sequential IDs to existing rows and
        # auto-increments for new inserts.
        bind.execute(sa.text(
            "ALTER TABLE verifications ADD COLUMN IF NOT EXISTS id SERIAL"
        ))
    else:
        # SQLite (local dev) — batch alter to add nullable integer
        try:
            with op.batch_alter_table('verifications') as batch_op:
                batch_op.add_column(sa.Column('id', sa.Integer(), nullable=True))
        except Exception:
            pass  # Column may already exist locally


def downgrade():
    bind = op.get_bind()
    if bind.dialect.name == 'postgresql':
        bind.execute(sa.text(
            "ALTER TABLE verifications DROP COLUMN IF EXISTS id"
        ))
    else:
        try:
            with op.batch_alter_table('verifications') as batch_op:
                batch_op.drop_column('id')
        except Exception:
            pass
