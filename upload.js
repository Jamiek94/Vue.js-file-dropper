module.exports = {
    template: '<div class="file-upload"><div :id="name"></div>' +
    '<div class="table-section">' +
    '<h5>Wachtrij</h5>' +
    '<div class="table-wrapper">' +
    '<table id="table-upload-queued" class="table table-responsive table-striped">' +
    '<thead>' +
    '<tr>' +
    '<th>Bestand</th>' +
    '<th>Progressie</th>' +
    '</tr>' +
    '</thead>' +
    '<tbody>' +
    '<tr v-show="queuedFiles.length === 0">' +
    '<td colspan="3">Er bevinden zich geen afbeelding in de wachtrij.</td>' +
    '</tr>' +
    '<tr v-for="file in queuedFiles">' +
    '<td>{{file.name}}</td>' +
    '<td>{{file.progress}}%</td>' +
    '</tr>' +
    '</tbody>' +
    '</table>' +
    '</div>' +
    '</div>' +
    '<div class="table-section" v-show="includeUploadCompleteTable">' +
    '<h5>Geüpload</h5>' +
    '<div id="table-upload-completed" class="table-wrapper">' +
    '<table class="table table-responsive table-striped">' +
    '<thead>' +
    '<tr>' +
    '<th>Bestand</th>' +
    '</tr>' +
    '</thead>' +
    '<tbody>' +
    '<tr v-show="!isUploading && hasNoCompletedFiles">' +
    '<td>Er zijn geen bestanden geüpload.</td>' +
    '</tr>' +
    '<tr v-for="file in queuedFiles" v-if="100 === file.progress">' +
    '<td>{{file.name}}</td>' +
    '</tr>' +
    '</tbody>' +
    '</table>' +
    '</div>' +
    '</div>' +
    '</div>',
    props: {
        name: {
            required: true,
            type: String
        },
        url: {
            required: true,
            type: String,
            default : "-"
        },
        accept : {
            required : false,
            type : String,
            default : "gif,.jpg,.png,.jpeg,.bmp"
        },
        label: {
            required: false,
            default: 'Drag and drop files or click to select',
            type: String
        },
        leave: {
            required: false,
            default: 'You have uploads pending, are you sure you want to leave this page?',
            type: String
        },
        maxQueue: {
            required: false,
            default: 2,
            type: Number
        },
        autoUpload: {
            required: false,
            type: Boolean,
            default: false
        },
        onCompleteName: {
            required: true,
            type: String
        },
        onStartName: {
            required: false,
            type: String
        },
        onQueuedName: {
            required: false,
            type: String
        },
        formData : {
            required : false,
            type : Object,
            default : {}
        },
        onFileProgressChangeName: {
            required: false,
            type: String
        },
        includeUploadCompleteTable: {
            required: false,
            type: Boolean,
            default: false
        }
    },
    computed: {
        'hasNoQueuedFiles': function () {
            for (var i = 0; this.queuedFiles.length > i; i++) {
                if (100 > this.queuedFiles[i].progress) {
                    return false;
                }
            }
            return true;
        },
        'hasNoCompletedFiles': function () {
            for (var i = 0; this.queuedFiles.length > i; i++) {
                if (this.queuedFiles[i].progress === 100) {
                    return false;
                }
            }
            return true;
        }
    },
    data: function () {
        return {
            isUploading: false,
            queuedFiles: []
        }
    },
    events: {
        'onStartFileUpload': function () {
            $("#" + this['name']).upload("start");
        },
        'onCancelFileUpload' : function(){
            $("#" + this['name']).upload("abort");
        }
    },
    ready: function () {
        var me = this;

        var targetElement = "#" + this['name'];
        var tableQueuedElement = "#table-upload-queued";
        var tableCompletedElement = "#table-upload-completed";
        
        $(document).ready(() => {
            
            $(targetElement).upload({
                action : me.url,
                label: me.label,
                maxQueue: me.maxQueue,
                autoUpload: me.autoUpload,
                accept : me.accept,
                beforeSend : (formData) => {
                    if(me.formData){
                        for(var key in me.formData){
                            formData.append(key, me.formData[key]);
                        }
                    }

                    return formData;
                }
            });

            $(targetElement).on('start', (data) => {
                if (me.onStartName) {
                    me.$dispatch(me.onStartName, data);
                }
            });

            $(targetElement).on('queued', (event, files) => {
                files.forEach((file) => {
                    file.progress = 0;
                    me['queuedFiles'].push(file);
                });

                scrollToBottom(tableQueuedElement);

                if (me.onQueuedName) {
                    me.$dispatch(me.onQueuedName, files);
                }
            });

            $(targetElement).on('complete', (data) => {
                me.$dispatch(me.onCompleteName, data);
                me['queuedFiles'] = [];
            });

            $(targetElement).on('fileprogress', (event, file, percent) => {
                me['queuedFiles'][file.index].progress = percent;

                if (me.onFileProgressChangeName) {
                    me.$dispatch(me.onFileProgressChangeName);
                }
            });

            $(targetElement).on('filecomplete', (event, file) => {
                scrollToBottom(tableCompletedElement);
            });
        })
    }
};

function scrollToBottom(target) {
    var d = $(target);
    d.scrollTop(d.prop("scrollHeight"));
}
