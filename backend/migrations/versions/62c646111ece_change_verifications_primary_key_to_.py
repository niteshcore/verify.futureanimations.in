"""safely add id SERIAL column to verifications (preserves all existing data)

Revision ID: 62c646111ece
Revises: bee98333b38d
Create Date: 2026-08-06 23:25:10.116176

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '62c646111ece'
down_revision = 'bee98333b38d'
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    if bind.dialect.name == 'postgresql':
        # ADD COLUMN IF NOT EXISTS id SERIAL — safe, preserves all existing rows
        # Existing rows get auto-assigned sequential IDs; new inserts auto-increment
        bind.execute(sa.text("""
            ALTER TABLE verifications
            ADD COLUMN IF NOT EXISTS id SERIAL
        """))
    else:
        # SQLite (local dev) — add nullable integer column
        try:
            with op.batch_alter_table('verifications') as batch_op:
                batch_op.add_column(sa.Column('id', sa.Integer(), nullable=True))
        except Exception:
            pass  # Column may already exist in local dev DB


def downgrade():
    bind = op.get_bind()
    if bind.dialect.name == 'postgresql':
        bind.execute(sa.text("""
            ALTER TABLE verifications DROP COLUMN IF EXISTS id
        """))
    else:
        try:
            with op.batch_alter_table('verifications') as batch_op:
                batch_op.drop_column('id')
        except Exception:
            pass
