import time
import urllib2
#should be run from: C:\Program Files\Tesseract-OCR
from PIL import Image
import pytesseract

import speech_recognition as sr

import pygame.camera



iteration_count=1
server="http://127.0.0.1:5000"
curses=['bitch','beach','f***','c***']
for i in range(iteration_count):
    points = 0

    #TODO: capture image from webcam
    ocr=pytesseract.image_to_string(Image.open(r"plates/plate1.jpg"))
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
	#TODO: send data to server, should be something like this:
    #urllib2.urlopen('{s}/asshole/{l}'.format(s=server,l=ocr)).read()
    time.sleep(1)