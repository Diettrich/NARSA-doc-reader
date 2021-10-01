FROM python:3

RUN apt-get update

WORKDIR /usr/src/app

RUN apt-get install -y tesseract-ocr

RUN apt-get install ffmpeg libsm6 libxext6  -y

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 5000

# CMD [ "python3", "-m" , "flask", "run"]

ENTRYPOINT [ "python3" ]

CMD [ "app.py" ]