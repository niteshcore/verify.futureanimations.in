"""change verifications primary key to auto_increment id

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
    # Safely drop index and table, then recreate
    try:
        op.drop_index('ix_verifications_verification_token', table_name='verifications')
    except Exception:
        pass
    
    try:
        op.drop_table('verifications')
    except Exception:
        pass
    
    op.create_table(
        'verifications',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('verification_token', sa.String(length=36), nullable=False),
        sa.Column('student_name', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=120), nullable=False),
        sa.Column('internship_role', sa.String(length=100), nullable=False),
        sa.Column('department', sa.String(length=100), nullable=False),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('end_date', sa.Date(), nullable=False),
        sa.Column('issue_date', sa.Date(), nullable=False),
        sa.Column('completion_status', sa.String(length=50), nullable=False),
        sa.Column('company_name', sa.String(length=100), nullable=False),
        sa.Column('signatory_name', sa.String(length=100), nullable=False),
        sa.Column('signatory_designation', sa.String(length=100), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False)
    )
    op.create_index('ix_verifications_verification_token', 'verifications', ['verification_token'], unique=True)


def downgrade():
    try:
        op.drop_index('ix_verifications_verification_token', table_name='verifications')
    except Exception:
        pass
        
    try:
        op.drop_table('verifications')
    except Exception:
        pass
    
    op.create_table(
        'verifications',
        sa.Column('verification_token', sa.String(length=36), primary_key=True, nullable=False),
        sa.Column('student_name', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=120), nullable=False),
        sa.Column('internship_role', sa.String(length=100), nullable=False),
        sa.Column('department', sa.String(length=100), nullable=False),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('end_date', sa.Date(), nullable=False),
        sa.Column('issue_date', sa.Date(), nullable=False),
        sa.Column('completion_status', sa.String(length=50), nullable=False),
        sa.Column('company_name', sa.String(length=100), nullable=False),
        sa.Column('signatory_name', sa.String(length=100), nullable=False),
        sa.Column('signatory_designation', sa.String(length=100), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False)
    )
    op.create_index('ix_verifications_verification_token', 'verifications', ['verification_token'], unique=False)
