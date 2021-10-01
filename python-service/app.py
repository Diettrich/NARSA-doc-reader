# create hello world flask app in python3
from flask import Flask, request
from flask_cors import CORS
import cv2
import numpy as np
import pytesseract


custom_config = r'--oem 3 --psm 6'

app = Flask(__name__)
CORS(app)


# class Field having 4 coordinates
class Field:
    def __init__(self, x1_percent, y1_percent, x2_percent, y2_percent):
        self.x1_percent = x1_percent
        self.y1_percent = y1_percent
        self.x2_percent = x2_percent
        self.y2_percent = y2_percent

    def drawRect(self, output):
        x1 = int(output.shape[1] * self.x1_percent / 100)
        y1 = int(output.shape[0] * self.y1_percent / 100)
        x2 = int(output.shape[1] * self.x2_percent / 100)
        y2 = int(output.shape[0] * self.y2_percent / 100)
        cv2.rectangle(output, (x1, y1), (x2, y2), (0, 255, 0), 2)

    def getCroppedImage(self, output):
        x1 = int(output.shape[1] * self.x1_percent / 100)
        y1 = int(output.shape[0] * self.y1_percent / 100)
        x2 = int(output.shape[1] * self.x2_percent / 100)
        y2 = int(output.shape[0] * self.y2_percent / 100)
        return output[y1:y2, x1:x2]

    def getDataInIt(self, image):
        return pytesseract.image_to_string(self.getCroppedImage(image), config=custom_config).strip()


# get grayscale image
def get_grayscale(image):
    return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# noise removal


def remove_noise(image):
    return cv2.medianBlur(image, 5)

# thresholding


def thresholding(image):
    return cv2.threshold(image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

# dilation


def dilate(image):
    kernel = np.ones((5, 5), np.uint8)
    return cv2.dilate(image, kernel, iterations=1)

# erosion


def erode(image):
    kernel = np.ones((5, 5), np.uint8)
    return cv2.erode(image, kernel, iterations=1)

# opening - erosion followed by dilation


def opening(image):
    kernel = np.ones((5, 5), np.uint8)
    return cv2.morphologyEx(image, cv2.MORPH_OPEN, kernel)

# canny edge detection


def canny(image):
    return cv2.Canny(image, 100, 200)

# skew correction


def deskew(image):
    coords = np.column_stack(np.where(image > 0))
    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle
    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(
        image, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    return rotated

# template matching


def match_template(image, template):
    return cv2.matchTemplate(image, template, cv2.TM_CCOEFF_NORMED)


def readAndTransformImage(imageFromRequest):
    numpyImage = np.fromfile(imageFromRequest, np.uint8)
    file = cv2.imdecode(numpyImage, cv2.IMREAD_COLOR)

    image = get_grayscale(file)
    image = cv2.threshold(image, 127, 255, 0)[1]

    return image


def getCinFace(requestFile):
    image = readAndTransformImage(requestFile)

    # coordinates of the 4 fields large space
    nameField = Field(0, 31, 50, 38)
    familyNameField = Field(0, 44, 50, 51)
    dateField = Field(20, 50, 40, 57)
    placeField = Field(2, 64, 50, 71)
    validDateField = Field(25, 70, 45, 77)
    idField = Field(68, 76, 88, 83)

    name = nameField.getDataInIt(image)
    familyName = familyNameField.getDataInIt(image)
    date = dateField.getDataInIt(image)
    place = placeField.getDataInIt(image)
    validDate = validDateField.getDataInIt(image)
    id = idField.getDataInIt(image)

    return {
        'name': name,
        'familyName': familyName,
        'date': date,
        'place': place,
        'validDate': validDate,
        'id': id
    }


def getCinBack(requestFile):
    image = readAndTransformImage(requestFile)

    # coordinates of the 4 fields large space
    idField = Field(10, 2, 22, 8)
    validDateField = Field(65, 2, 80, 9)
    fatherNameField = Field(12, 23, 60, 29)
    motherNameField = Field(10, 29, 60, 36)
    addressField = Field(12.3, 48, 75, 56)
    maritalStatusField = Field(20, 60, 40, 68)
    genderField = Field(80, 60, 88, 68)

    id = idField.getDataInIt(image)
    validDate = validDateField.getDataInIt(image)
    fatherName = fatherNameField.getDataInIt(image)
    motherName = motherNameField.getDataInIt(image)
    address = addressField.getDataInIt(image)
    maritalStatus = maritalStatusField.getDataInIt(image)
    gender = genderField.getDataInIt(image)

    return {
        'id': id,
        'validDate': validDate,
        'fatherName': fatherName,
        'motherName': motherName,
        'address': address,
        'maritalStatus': maritalStatus,
        'gender': gender,
    }


# handle post request having image in request data
# return the same image in response
@app.route("/api", methods=['POST'])
def mainAPI():
    result = dict()

    if "CIN1" in request.files:
        file_CIN1 = request.files["CIN1"]
        result["CIN1"] = getCinFace(file_CIN1)

    print(result)

    if "CIN2" in request.files:
        file_CIN2 = request.files["CIN2"]
        result["CIN2"] = getCinBack(file_CIN2)
    # if "PERMIS1" in request.files:
    #     file_PERMIS1 = request.files["PERMIS1"]
    #     result["PERMIS1"] = getCinFace(file_PERMIS1)

    # if "PERMIS2" in request.files:
    #     file_PERMIS2 = request.files["PERMIS2"]
    #     result["PERMIS2"] = getCinFace(file_PERMIS2)

    print(result)

    return {
        'status': 'success',
        'result': result
    }

@app.route("/api/test", methods=['GET'])
def testAPI():
    return {
        'status': 'success',
        'result': 'test'
    }

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')