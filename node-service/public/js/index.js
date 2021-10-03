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

const verified = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
  <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
</svg>
`

const notVerified = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
  <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/>
</svg>
`

function printPrediction(data) {
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
        document.getElementById("predicted-valid-date").innerHTML = data.result.CIN1.validDate;
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
    // predicted-num-permis
    // predicted-name-permis
    // predicted-family-name-permis
    // predicted-birthdate-permis
    // predicted-birth-place-permis
    // predicted-CNI
    // predicted-delivred-time
    // predicted-type
    if (data.result.PERMIS1) {
        document.getElementById("predicted-num-permis").innerHTML = data.result.PERMIS1.permisNumber;
        document.getElementById("predicted-name-permis").innerHTML = data.result.PERMIS1.name;
        document.getElementById("predicted-family-name-permis").innerHTML = data.result.PERMIS1.familyName;
        document.getElementById("predicted-birthdate-permis").innerHTML = data.result.PERMIS1.date;
        document.getElementById("predicted-birth-place-permis").innerHTML = data.result.PERMIS1.place;
        document.getElementById("predicted-CNI").innerHTML = data.result.PERMIS1.CIN;
        document.getElementById("predicted-delivred-place").innerHTML = data.result.PERMIS1.deliveryPlace;
        document.getElementById("predicted-delivred-time").innerHTML = data.result.PERMIS1.deliveryDate;
        document.getElementById("predicted-type").innerHTML = data.result.PERMIS1.permisType;
    }
    // predicted-duplicata
    // predicted-validity
    // predicted-serie-1
    // predicted-serie-2
    if (data.result.PERMIS2) {
        // document.getElementById("predicted-duplicata").innerHTML = data.result.PERMIS2.;
        document.getElementById("predicted-validity").innerHTML = data.result.PERMIS2.endOfValidity;
        document.getElementById("predicted-serie-1").innerHTML = data.result.PERMIS2.smallSeries;
        document.getElementById("predicted-serie-2").innerHTML = data.result.PERMIS2.largeSeries;
    }
}


// return-num-permis
// return-name-permis
// return-family-name-permis
// return-birth-place-permis
// return-CNI
function nothingFound() {
    document.getElementById("return-num-permis").innerHTML = notVerified;
    document.getElementById("return-name-permis").innerHTML = notVerified;
    document.getElementById("return-family-name-permis").innerHTML = notVerified;
    document.getElementById("return-birth-place-permis").innerHTML = notVerified;
    document.getElementById("return-CNI").innerHTML = notVerified;
}

// "result": {
//     "nom": "FIZAZI",
//     "prenom": "HICHAM",
//     "numeroCIN": "BE474153",
//     "ville": "CASABLANCA",
//     "numeroPermis": "N/A"
// }
function found(data) {
    document.getElementById("return-num-permis").innerHTML = verified + " (" + data.numeroPermis + ")";
    document.getElementById("return-name-permis").innerHTML = verified + " (" + data.nom + ")";
    document.getElementById("return-family-name-permis").innerHTML = verified + " (" + data.prenom + ")";
    document.getElementById("return-birth-place-permis").innerHTML = verified + " (" + data.ville + ")";
    document.getElementById("return-CNI").innerHTML = verified + " (" + data.numeroCIN + ")";
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
                    printPrediction(data)
                }
            })
            .then((cin) => {
                fetch("/api", {
                    method: "POST",
                    body: {
                        cin: cin
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            found(data);
                        }
                        else {
                            found(data);
                        }
                    })
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
