import time
#should be run from: C:\Program Files\Tesseract-OCR
from PIL import Image
import pytesseract

import speech_recognition as sr

import pygame.camera

iteration_count=1
curses=['bitch','beach','f***','c***']
for i in range(iteration_count):
    points=0
    #TODO: capture image from webcam
    ocr=pytesseract.image_to_string(Image.open(r"plate.jpg"))
    print (ocr)
    # obtain audio from the microphone
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Say something!")
        audio = r.listen(source)
    speech=''
    try:
        speech=r.recognize_google(audio)
        print (speech)
    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand audio")
    except sr.RequestError:
        print("Could not request results from Google Speech Recognition service")
    points=len([c for c in curses if speech.find(c)>-1])
    print (points)
    #TODO: If speech contains curse-words, update server with license plate and words
    time.sleep(1)