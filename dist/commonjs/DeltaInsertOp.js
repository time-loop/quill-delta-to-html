"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var value_types_1 = require("./value-types");
var InsertData_1 = require("./InsertData");
var lodash_isequal_1 = __importDefault(require("lodash.isequal"));
var lodash_find_1 = __importDefault(require("lodash.find"));
var DeltaInsertOp = (function () {
    function DeltaInsertOp(insertVal, attrs) {
        if (typeof insertVal === 'string') {
            insertVal = new InsertData_1.InsertDataQuill(value_types_1.DataType.Text, insertVal + '');
        }
        this.insert = insertVal;
        this.attributes = attrs || {};
    }
    DeltaInsertOp.createNewLineOp = function () {
        return new DeltaInsertOp(value_types_1.NewLine);
    };
    DeltaInsertOp.prototype.isContainerBlock = function (blocksCanBeWrappedWithList) {
        if (blocksCanBeWrappedWithList === void 0) { blocksCanBeWrappedWithList = []; }
        return (this.isBlockquote() ||
            this.isList() ||
            this.isTableCellLine() ||
            this.isTableCol() ||
            this.isCodeBlock() ||
            this.isHeader() ||
            this.isBlockAttribute() ||
            this.isCustomTextBlock() ||
            this.isListBlockWrapper(blocksCanBeWrappedWithList));
    };
    DeltaInsertOp.prototype.isBlockAttribute = function () {
        var attrs = this.attributes;
        return !!(attrs.align || attrs.direction || attrs.indent);
    };
    DeltaInsertOp.prototype.isBlockquote = function () {
        return !!this.attributes.blockquote;
    };
    DeltaInsertOp.prototype.isHeader = function () {
        return !!this.attributes.header;
    };
    DeltaInsertOp.prototype.isTableCellLine = function () {
        return !!this.attributes['table-cell-line'];
    };
    DeltaInsertOp.prototype.isTableCol = function () {
        return !!this.attributes['table-col'];
    };
    DeltaInsertOp.prototype.isSameHeaderAs = function (op) {
        return op.attributes.header === this.attributes.header && this.isHeader();
    };
    DeltaInsertOp.prototype.hasSameAdiAs = function (op) {
        return (this.attributes.align === op.attributes.align &&
            this.attributes.direction === op.attributes.direction &&
            this.attributes.indent === op.attributes.indent);
    };
    DeltaInsertOp.prototype.hasSameIndentationAs = function (op, blocksCanBeWrappedWithList) {
        var _this = this;
        if (blocksCanBeWrappedWithList === void 0) { blocksCanBeWrappedWithList = []; }
        var getIndent = function (insertOp) {
            if (insertOp.isListBlockWrapper(blocksCanBeWrappedWithList)) {
                var attrKey = lodash_find_1.default(blocksCanBeWrappedWithList, function (key) { return !!_this.attributes[key]; }) ||
                    '';
                return parseInt(insertOp.attributes[attrKey]['wrapper-indent'], 10);
            }
            else {
                return insertOp.attributes.indent;
            }
        };
        var thisIndent = getIndent(this);
        var opIndent = getIndent(op);
        return thisIndent === opIndent;
    };
    DeltaInsertOp.prototype.hasSameAttr = function (op) {
        return lodash_isequal_1.default(this.attributes, op.attributes);
    };
    DeltaInsertOp.prototype.hasHigherIndentThan = function (op, blocksCanBeWrappedWithList) {
        var _this = this;
        if (blocksCanBeWrappedWithList === void 0) { blocksCanBeWrappedWithList = []; }
        var getIndent = function (insertOp) {
            if (insertOp.isListBlockWrapper(blocksCanBeWrappedWithList)) {
                var attrKey = lodash_find_1.default(blocksCanBeWrappedWithList, function (key) { return !!_this.attributes[key]; }) ||
                    '';
                return attrKey && insertOp.attributes[attrKey] &&
                    parseInt(insertOp.attributes[attrKey]['wrapper-indent'], 10);
            }
            else {
                return insertOp.attributes.indent;
            }
        };
        var thisIndent = getIndent(this);
        var opIndent = getIndent(op);
        return (Number(thisIndent) || 0) > (Number(opIndent) || 0);
    };
    DeltaInsertOp.prototype.isInline = function () {
        return !(this.isContainerBlock() ||
            this.isVideo() ||
            this.isCustomEmbedBlock());
    };
    DeltaInsertOp.prototype.isCodeBlock = function () {
        return !!this.attributes['code-block'];
    };
    DeltaInsertOp.prototype.hasSameLangAs = function (op) {
        var thisCodeLang = (this.attributes['code-block'] &&
            this.attributes['code-block']['code-block']) ||
            true;
        var opCodeLang = (op.attributes['code-block'] &&
            op.attributes['code-block']['code-block']) ||
            true;
        return thisCodeLang === opCodeLang;
    };
    DeltaInsertOp.prototype.isJustNewline = function () {
        return this.insert.value === value_types_1.NewLine;
    };
    DeltaInsertOp.prototype.isList = function () {
        return (this.isOrderedList() ||
            this.isBulletList() ||
            this.isCheckedList() ||
            this.isToggledList() ||
            this.isNoneTypeList() ||
            this.isUncheckedList());
    };
    DeltaInsertOp.prototype.isOrderedList = function () {
        return (!!this.attributes.list && this.attributes.list.list === value_types_1.ListType.Ordered);
    };
    DeltaInsertOp.prototype.isBulletList = function () {
        return (!!this.attributes.list && this.attributes.list.list === value_types_1.ListType.Bullet);
    };
    DeltaInsertOp.prototype.isCheckedList = function () {
        return (!!this.attributes.list && this.attributes.list.list === value_types_1.ListType.Checked);
    };
    DeltaInsertOp.prototype.isToggledList = function () {
        return (!!this.attributes.list && this.attributes.list.list === value_types_1.ListType.Toggled);
    };
    DeltaInsertOp.prototype.isNoneTypeList = function () {
        return (!!this.attributes.list && this.attributes.list.list === value_types_1.ListType.NoneType);
    };
    DeltaInsertOp.prototype.isUncheckedList = function () {
        return (!!this.attributes.list &&
            this.attributes.list.list === value_types_1.ListType.Unchecked);
    };
    DeltaInsertOp.prototype.isACheckList = function () {
        return (!!this.attributes.list &&
            (this.attributes.list.list == value_types_1.ListType.Unchecked ||
                this.attributes.list.list === value_types_1.ListType.Checked));
    };
    DeltaInsertOp.prototype.isSameListAs = function (op) {
        return (!!this.attributes.list &&
            !!op.attributes.list &&
            (this.attributes.list.list === op.attributes.list.list ||
                (op.isACheckList() && this.isACheckList())) &&
            this.attributes.list.cell === op.attributes.list.cell);
    };
    DeltaInsertOp.prototype.isSameTableCellAs = function (op, blocksCanBeWrappedWithList) {
        if (blocksCanBeWrappedWithList === void 0) { blocksCanBeWrappedWithList = []; }
        var getCellId = function (insertOp) {
            if (insertOp.isTableCellLine()) {
                return insertOp.attributes['table-cell-line'].cell;
            }
            else {
                if (insertOp.isListBlockWrapper(blocksCanBeWrappedWithList)) {
                    var attrKey = blocksCanBeWrappedWithList.find(function (key) { return !!insertOp.attributes[key]; }) || '';
                    return insertOp.attributes[attrKey].cell;
                }
                else {
                    return insertOp.attributes['list'].cell;
                }
            }
        };
        var thisCell = getCellId(this);
        var opCell = getCellId(op);
        return thisCell && opCell && thisCell === opCell;
    };
    DeltaInsertOp.prototype.isText = function () {
        return this.insert.type === value_types_1.DataType.Text;
    };
    DeltaInsertOp.prototype.isImage = function () {
        return this.insert.type === value_types_1.DataType.Image;
    };
    DeltaInsertOp.prototype.isFormula = function () {
        return this.insert.type === value_types_1.DataType.Formula;
    };
    DeltaInsertOp.prototype.isVideo = function () {
        return this.insert.type === value_types_1.DataType.Video;
    };
    DeltaInsertOp.prototype.isLink = function () {
        return this.isText() && !!this.attributes.link;
    };
    DeltaInsertOp.prototype.isCustomEmbed = function () {
        return this.insert instanceof InsertData_1.InsertDataCustom;
    };
    DeltaInsertOp.prototype.isCustomEmbedBlock = function () {
        return this.isCustomEmbed() && !!this.attributes.renderAsBlock;
    };
    DeltaInsertOp.prototype.isCustomTextBlock = function () {
        return this.isText() && !!this.attributes.renderAsBlock;
    };
    DeltaInsertOp.prototype.isMentions = function () {
        return this.isText() && !!this.attributes.mentions;
    };
    DeltaInsertOp.prototype.isListBlockWrapper = function (blocksCanBeWrappedWithList) {
        var _this = this;
        if (blocksCanBeWrappedWithList === void 0) { blocksCanBeWrappedWithList = []; }
        var attrKey = lodash_find_1.default(blocksCanBeWrappedWithList, function (key) { return !!_this.attributes[key]; });
        return !!(attrKey &&
            this.attributes &&
            this.attributes[attrKey] &&
            this.attributes[attrKey]['in-list']);
    };
    return DeltaInsertOp;
}());
exports.DeltaInsertOp = DeltaInsertOp;
