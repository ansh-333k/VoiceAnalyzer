from application import db, mm
from datetime import datetime, timedelta

timestamp = (datetime.now() + timedelta(hours=5, minutes=30)).strftime("%Y-%m-%d %H:%M:%S")


class User(db.Model):
  __tablename__ = 'user'
  email = db.Column('email',
                    db.String(64),
                    nullable=False,
                    unique=True,
                    primary_key=True)
  password = db.Column('password', db.String(16), nullable=False)


class Transcript(db.Model):
  __tablename__ = 'transcript'
  id = db.Column('id',
                 db.Integer,
                 nullable=False,
                 unique=True,
                 primary_key=True,
                 autoincrement=True)
  user_email = db.Column('user_email',
                         db.String(64),
                         db.ForeignKey(User.email),
                         nullable=False)
  text = db.Column('text', db.String(16384), nullable=False)
  timestamp = db.Column('timestamp', nullable=False, default=timestamp)


class UserSchema(mm.SQLAlchemyAutoSchema):

  class Meta:
    fields = ['email']


user_schema = UserSchema()
users_schema = UserSchema(many=True)


class TranscriptSchema(mm.SQLAlchemyAutoSchema):

  class Meta:
    fields = ['id', 'user_email', 'text', 'timestamp']


transcript_schema = TranscriptSchema()
transcripts_schema = TranscriptSchema(many=True)