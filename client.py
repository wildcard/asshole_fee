import urllib2
import subprocess
import os

import speech_recognition as sr
import pygame.camera
import pygame.image
import colorama


def detect_lpr(image, us=True):
    # #Returns the license plate number from an image
    cmd = ''
    if us:
        cmd = 'alpr -c us %s' % image
    else:
        cmd = 'alpr -c eu %s' % image
    out = subprocess.check_output([cmd], shell=True, env=os.environ)

    if 'No license plates found' in out:
        return 'No license plates found'

    lines = out.splitlines()
    license_plate = lines[1][6:12]
    if us and len(license_plate.strip()) != 6:
        return 'No license plates found'
    return license_plate

def capture_image(path):
    img = cam.get_image()
    pygame.image.save(img, path)

iteration_count = 1000
server = 'http://127.0.0.1:5000'
curses = ['bitch', 'beach', 'biatch', 'shit', 'ass', '*']


pygame.camera.init()
cam = pygame.camera.Camera(pygame.camera.list_cameras()[0])
cam.start()
colorama.init()


for i in range(iteration_count):
    points = 0

    path = 'plates/new_plate.jpg'
    print i
    capture_image(path)

    lpr = detect_lpr(path)
    if lpr != 'No license plates found':
        print colorama.Fore.YELLOW + lpr
        print colorama.Fore.WHITE
        break

    print colorama.Fore.RED + lpr
    print colorama.Fore.WHITE

# obtain audio from the microphone
print colorama.Fore.BLACK
r = sr.Recognizer()

with sr.Microphone() as source:
    print colorama.Fore.WHITE
    print('Say something!')
    audio = r.listen(source)
    print('Done listening!')
speech = ''
try:
    speech = r.recognize_google(audio)
    print colorama.Fore.GREEN + speech + colorama.Fore.WHITE
except sr.UnknownValueError:
    print('Google Speech Recognition could not understand audio')
except sr.RequestError:
    print('Could not request results from Google Speech Recognition service')
points = len([c for c in curses if speech.find(c) > - 1])
# print (points)
if points > 0:
    urllib2.urlopen('{s}/asshole/{l}'.format(s=server,l=lpr)).read()

cam.stop()
pygame.camera.quit()
