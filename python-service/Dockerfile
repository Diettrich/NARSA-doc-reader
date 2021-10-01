FROM python:3.8-slim-buster

RUN apt-get update && apt-get install -y apt-transport-https

RUN apt-get install -y tesseract-ocr

RUN apt-get install ffmpeg libsm6 libxext6  -y

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 5000

# CMD [ "python3", "-m" , "flask", "run"]

ENTRYPOINT [ "python3" ]

CMD [ "app.py" ]