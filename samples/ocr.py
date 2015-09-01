#should run from tesseract installation dir
from PIL import Image
import pytesseract
print(pytesseract.image_to_string(Image.open(r"D:\Temp\dsis.png")))