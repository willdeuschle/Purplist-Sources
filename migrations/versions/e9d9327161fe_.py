"""empty message

Revision ID: e9d9327161fe
Revises: 3150d0bc48e8
Create Date: 2017-01-22 15:21:40.678139

"""

# revision identifiers, used by Alembic.
revision = 'e9d9327161fe'
down_revision = '3150d0bc48e8'

from alembic import op
import sqlalchemy as sa


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('social_id', sa.String(length=64), nullable=False),
    sa.Column('nickname', sa.String(length=64), nullable=False),
    sa.Column('email', sa.String(length=64), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('social_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('users')
    # ### end Alembic commands ###