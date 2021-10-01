const CIN1Input = document.getElementById('CIN1');
const CIN2Input = document.getElementById('CIN2');
const Permis1Input = document.getElementById('PERMIS1');
const Permis2Input = document.getElementById('PERMIS2');
const EditCIN1 = document.getElementById('Edit1');
const EditCIN2 = document.getElementById('Edit2');
const EditPermis1 = document.getElementById('Edit-PERMIS1');
const EditPermis2 = document.getElementById('Edit-PERMIS2');

const modal = new bootstrap.Modal(document.getElementById('modal'));

let selected;

let editableCin1 = false;
let editableCin2 = false;
let editablePermis1 = false;
let editablePermis2 = false;

let canSubmit = false;

var cropBoxData;
var canvasData;
var cropper;

let outputImage = document.getElementById("image");
let imageFile;

let formData = new FormData();

document.getElementById('modal').addEventListener('shown.bs.modal', () => {
    cropper = new Cropper(outputImage, {
        dragMode: "move",
    });
});

document.getElementById('modal').addEventListener('hidden.bs.modal', () => {
    cropper.destroy();
});

const inputHandler = (selected, inputElement) => (event) => {
    imageFile = event.target.files[0];
    outputImage = document.getElementById("image");


    const reader = new FileReader();
    reader.readAsDataURL(imageFile);

    reader.onload = function (event) {
        outputImage.src = event.target.result;
    }

    modal.show();

    editableCin1 = true;
    inputElement.disabled = false;

    document.getElementById("save-button").addEventListener('click', preview(selected), { once: true });

    // to change after
    canSubmit = true;
}

const editHandler = (selected, inputElement) => (event) => {
    if (editableCin1) {
        imageFile = inputElement.files[0];
        outputImage = document.getElementById("image");


        const reader = new FileReader();
        reader.readAsDataURL(imageFile);

        reader.onload = function (event) {
            outputImage.src = event.target.result;
        }

        document.getElementById("save-button").addEventListener('click', preview(selected), { once: true });
        modal.show();
    }
}

// ========================= CIN1 (face) ========================= //

CIN1Input.addEventListener('change', inputHandler("CIN1", EditCIN1));
EditCIN1.addEventListener('click', editHandler("CIN1", CIN1Input));

// ========================= CIN2 (dos) ========================== //

CIN2Input.addEventListener('change', inputHandler("CIN2", EditCIN2));
EditCIN2.addEventListener('click', editHandler("CIN2", CIN2Input));

// ======================= PERMIS1 (face) ======================== //

Permis1Input.addEventListener('change', inputHandler("PERMIS1", EditPermis1));
EditPermis1.addEventListener('click', editHandler("PERMIS1", Permis1Input));

// ======================= PERMIS2 (dos) ========================= //

Permis2Input.addEventListener('change', inputHandler("PERMIS2", EditPermis2));
EditPermis2.addEventListener('click', editHandler("PERMIS2", Permis2Input));

// =============================================================== //


const preview = (selected) => (e) => {
    const img = new Image();

    const canvasElement = cropper.getCroppedCanvas();

    canvasElement.toBlob(function (blob) {
        formData.append(selected, blob);
    });

    img.src = canvasElement.toDataURL();
    document.getElementById("img-" + selected).src = img.src;
    document.getElementById("img-" + selected).style.display = "block";

    modal.hide();
}

function submit() {
    if (canSubmit) {
        fetch("http://127.0.0.1:5000/api", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {

                    // "predicted-name"
                    // "predicted-family-name"
                    // "predicted-date"
                    // "predicted-place"
                    // "predicted-valid-date"
                    // "predicted-id"
                    console.log(data.result)
                    if (data.result.CIN1) {
                        document.getElementById("predicted-name").innerHTML = data.result.CIN1.name;
                        document.getElementById("predicted-family-name").innerHTML = data.result.CIN1.familyName;
                        document.getElementById("predicted-date").innerHTML = data.result.CIN1.date;
                        document.getElementById("predicted-place").innerHTML = data.result.CIN1.place;
                        document.getElementById("predicted-valid-date").innerHTML = data.result.CIN1.date;
                        document.getElementById("predicted-id").innerHTML = data.result.CIN1.id;
                    }
                    // predicted-id-back
                    // predicted-valid-date-back
                    // predicted-father
                    // predicted-mother
                    // predicted-address
                    // predicted-marital-status
                    // predicted-gender
                    if (data.result.CIN2) {
                        document.getElementById("predicted-id-back").innerHTML = data.result.CIN2.id;
                        document.getElementById("predicted-valid-date-back").innerHTML = data.result.CIN2.validDate;
                        document.getElementById("predicted-father").innerHTML = data.result.CIN2.fatherName;
                        document.getElementById("predicted-mother").innerHTML = data.result.CIN2.motherName;
                        document.getElementById("predicted-address").innerHTML = data.result.CIN2.address;
                        document.getElementById("predicted-marital-status").innerHTML = data.result.CIN2.maritalStatus;
                        document.getElementById("predicted-gender").innerHTML = data.result.CIN2.gender;
                    }

                }
            });
    }
}

document.getElementById("submit").addEventListener("click", submit);

function rotateToLeft() {
    cropper.rotate(-0.5);
}

function rotateToRight() {
    cropper.rotate(0.5);
}

function bigRotateToLeft() {
    cropper.rotate(-90);
}

function bigRotateToRight() {
    cropper.rotate(90);
}
