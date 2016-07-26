# Vue.js-file-dropper
A vue.js wrapper for FormStone's upload component.

#### Requirements

* jQuery
* FormStone core (https://github.com/Formstone/Formstone/blob/master/dist/js/core.js)
* Formstone upload (https://github.com/Formstone/Formstone/blob/master/dist/js/upload.js)
* Vue.js
* Bootstrap

#### Example

````html

  <file-upload name="photoUpload" :url="addPhoto.photoUploadUrl" :form-data.sync="addPhoto.model"
                             :include-upload-complete-table="false" on-complete-name="onUploadComplete"
                             on-queued-name="onUploadQueue"
                             :auto-upload="false"
                             :max-queue="5"
                             label="Voeg foto's toe door middel van hierop te klikken of bestanden hier naar toe te slepen."
                             leave="Weet u zeker dat u de pagina wilt verlaten? Er zijn nog foto's toegevoegd die nog niet zijn opgeslagen."></file-upload>

````

#### Info

Some texts are hardcoded dutch in the template, you will have to update them manually.
I'll make properties of these texts later on.

Because I always want to show the progress of the files, I included a bootstrap table which display all the queued files which shows the upload progress of each file.

Feel free to contribute!

