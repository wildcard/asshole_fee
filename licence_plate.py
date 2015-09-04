import sys
import subprocess
import os


def detect(image):
    cmd = 'alpr -c eu %s' % image

    out = subprocess.check_output([cmd], shell=True, env=os.environ)
    lines = out.splitlines()
    res_num = lines[0][8:10]

    licence_plate = lines[1][6:12] #can we have bigger licence plate??
    accuracy = lines[1][26:]

    print 'Best results (out of %s) with accuracy %s is: %s' %(res_num, accuracy, licence_plate)

if __name__ == '__main__':

    if len(sys.argv) < 2:
        print "Usage: python licence_plate.py image.jpg"
        sys.exit(-1)
    detect(sys.argv[1])