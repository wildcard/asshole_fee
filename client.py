import time
import urllib2
import subprocess
import os
#should be run from: C:\Program Files\Tesseract-OCR
from PIL import Image
import pytesseract

import speech_recognition as sr

import pygame.camera

def detect_lpr(image):
    # #Returns the license plate number from an image
    cmd = 'alpr -c eu %s' % image
    print cmd
    out = subprocess.check_output([cmd], shell=True, env=os.environ)
    lines = out.splitlines()
    res_num = lines[0][8:10]
    license_plate = lines[1][6:12] #can we have bigger licence plate??
    accuracy = lines[1][24:]
    return license_plate

iteration_count=1
server="http://127.0.0.1:5000"
curses=['bitch','beach','f***','c***']
for i in range(iteration_count):
    points = 0

    #TODO: capture image from webcam
    #lpr=pytesseract.image_to_string(Image.open(r"plates/plate1.jpg"))
    lpr=detect_lpr(r"plates/plate.jpg")
    print (lpr)
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
    #urllib2.urlopen('{s}/asshole/{l}'.format(s=server,l=lpr)).read()
    time.sleep(1)