//noinspection JSUnusedGlobalSymbols
/**
 * Checks if value is file
 * @constructor
 * @author acanthis@ya.ru
 */
function SymfonyComponentValidatorConstraintsFile() {
    this.maxSize = null;
    this.maxSizeBytes = 0;
    this.mimeTypes = [];
    this.maxSizeMessage = 'The file is too large ({{ size }} {{ suffix }}). Allowed maximum size is {{ limit }} {{ suffix }}.';
    this.mimeTypesMessage = 'The mime type of the file is invalid ({{ type }}). Allowed mime types are {{ types }}.';

    this.validate = function (value, element) {
        var errors = [];
        var f = FpJsFormValidator;
        var elFiles = element.domNode.files;
        if (typeof(elFiles) === 'object' && elFiles.length > 0 && typeof(elFiles[0]) === 'object') {
            var elFile = elFiles[0];
            if (this.maxSizeBytes > 0 && elFile.size > this.maxSizeBytes) {
                var message = this.maxSizeMessage.replace('{{ size }}', this.bytesToSize(elFile.size));
                errors.push(message);
            }
            if (this.checkMimeType(elFile.type)) {
                errors.push(this.mimeTypesMessage.replace('{{ type }}', elFile.type));
            }
        }

        return errors;
    };

    this.checkMimeType = function (mimeType) {
        return (
            this.mimeTypes.indexOf(mimeType) < 0
        );
    };

    this.onCreate = function () {
        if (this.maxSize) {
            this.maxSizeMessage = FpJsBaseConstraint.prepareMessage(this.maxSizeMessage, {'{{ limit }}': this.bytesToSize(this.maxSize), ' {{ suffix }}': ''}, this.maxSize);
            this.maxSizeBytes = this.sizeToBytes(this.maxSize);
        }
        if (this.mimeTypes) {
            this.mimeTypesMessage = FpJsBaseConstraint.prepareMessage(this.mimeTypesMessage, {'{{ types }}': this.mimeTypes.join()}, this.mimeTypes);
        }
    };

    this.bytesToSize = function(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return 'n/a';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        if (i == 0) return bytes + ' ' + sizes[i];

        return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    };

    this.sizeToSuffixBytes = function(bytes)
    {
        return parseFloat(bytes, 2) + ' ' + bytes.toString().replace(/[^A-Za-z\.]+/g, '').replace('B', '').replace('b', '').toUpperCase() + 'B';
    };

    this.sizeToBytes = function sizeToBytes(size){
        var scale = 1;
        size = size.toString();
        if (~ size.indexOf('k')){
            scale = 1024;
        } else if (~ size.indexOf('m') || ~ size.indexOf('M')){
            scale = 1024 * 1024;
        } else if (~ size.indexOf('g')){
            scale = 1024 * 1024 * 1024;
        }

        return parseInt(size, 10) * scale;
    }
}
