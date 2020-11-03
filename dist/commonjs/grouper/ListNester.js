"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var group_types_1 = require("./group-types");
var array_1 = require("./../helpers/array");
var lodash_find_1 = __importDefault(require("lodash.find"));
var ListNester = (function () {
    function ListNester(blocksCanBeWrappedWithList) {
        if (blocksCanBeWrappedWithList === void 0) { blocksCanBeWrappedWithList = []; }
        this.blocksCanBeWrappedWithList = blocksCanBeWrappedWithList;
    }
    ListNester.prototype.nest = function (groups) {
        var _this = this;
        var listBlocked = this.convertListBlocksToListGroups(groups);
        var groupedByListGroups = this.groupConsecutiveListGroups(listBlocked);
        var nested = array_1.flatten(groupedByListGroups.map(function (group) {
            if (!Array.isArray(group)) {
                return group;
            }
            return _this.nestListSection(group);
        }));
        var groupRootLists = array_1.groupConsecutiveElementsWhile(nested, function (curr, prev) {
            if (!(curr instanceof group_types_1.ListGroup && prev instanceof group_types_1.ListGroup)) {
                return false;
            }
            return curr.items[0].item.op.isSameListAs(prev.items[0].item.op) ||
                curr.items[0].item.op.isListBlockWrapper(_this.blocksCanBeWrappedWithList) ||
                prev.items[0].item.op.isListBlockWrapper(_this.blocksCanBeWrappedWithList);
        });
        return groupRootLists.map(function (v) {
            if (!Array.isArray(v)) {
                return v;
            }
            var litems = v.map(function (g) { return g.items; });
            return new group_types_1.ListGroup(array_1.flatten(litems));
        });
    };
    ListNester.prototype.convertListBlocksToListGroups = function (items) {
        var _this = this;
        var hasSameIndentation = function (g, gPrev) {
            var gAttrKey = lodash_find_1.default(_this.blocksCanBeWrappedWithList, function (key) { return !!g.op.attributes[key]; });
            var gIndent = gAttrKey && g.op.isListBlockWrapper(_this.blocksCanBeWrappedWithList)
                ? parseInt(g.op.attributes[gAttrKey]['wrapper-indent'], 10)
                : g.op.attributes.indent;
            var gPrevAttrKey = lodash_find_1.default(_this.blocksCanBeWrappedWithList, function (key) { return !!gPrev.op.attributes[key]; });
            var gPrevIndent = gPrevAttrKey && gPrev.op.isListBlockWrapper(_this.blocksCanBeWrappedWithList)
                ? parseInt(gPrev.op.attributes[gPrevAttrKey]['wrapper-indent'], 10)
                : gPrev.op.attributes.indent;
            return gIndent === gPrevIndent;
        };
        var grouped = array_1.groupConsecutiveElementsWhile(items, function (g, gPrev) {
            return (g instanceof group_types_1.BlockGroup &&
                gPrev instanceof group_types_1.BlockGroup &&
                g.op.isList() &&
                gPrev.op.isList() &&
                g.op.isSameListAs(gPrev.op) &&
                g.op.hasSameIndentationAs(gPrev.op, _this.blocksCanBeWrappedWithList)) || (g instanceof group_types_1.BlockGroup &&
                gPrev instanceof group_types_1.BlockGroup &&
                ((g.op.isListBlockWrapper(_this.blocksCanBeWrappedWithList) && gPrev.op.isList()) ||
                    (g.op.isList() && gPrev.op.isListBlockWrapper(_this.blocksCanBeWrappedWithList)) ||
                    (g.op.isListBlockWrapper(_this.blocksCanBeWrappedWithList) && gPrev.op.isListBlockWrapper(_this.blocksCanBeWrappedWithList))) &&
                hasSameIndentation(g, gPrev));
        });
        return grouped.map(function (item) {
            if (!Array.isArray(item)) {
                if (item instanceof group_types_1.BlockGroup &&
                    (item.op.isList() || item.op.isListBlockWrapper(_this.blocksCanBeWrappedWithList))) {
                    return new group_types_1.ListGroup([new group_types_1.ListItem(item)]);
                }
                return item;
            }
            return new group_types_1.ListGroup(item.map(function (g) { return new group_types_1.ListItem(g); }));
        });
    };
    ListNester.prototype.groupConsecutiveListGroups = function (items) {
        return array_1.groupConsecutiveElementsWhile(items, function (curr, prev) {
            return curr instanceof group_types_1.ListGroup && prev instanceof group_types_1.ListGroup;
        });
    };
    ListNester.prototype.nestListSection = function (sectionItems) {
        var _this = this;
        var indentGroups = this.groupByIndent(sectionItems);
        Object.keys(indentGroups)
            .map(Number)
            .sort()
            .reverse()
            .forEach(function (indent) {
            indentGroups[indent].forEach(function (lg) {
                var idx = sectionItems.indexOf(lg);
                if (_this.placeUnderParent(lg, sectionItems.slice(0, idx))) {
                    sectionItems.splice(idx, 1);
                }
            });
        });
        return sectionItems;
    };
    ListNester.prototype.groupByIndent = function (items) {
        var _this = this;
        return items.reduce(function (pv, cv) {
            var indent;
            if (cv.items[0].item.op.isListBlockWrapper(_this.blocksCanBeWrappedWithList)) {
                var attrKey = lodash_find_1.default(_this.blocksCanBeWrappedWithList, function (key) { return !!cv.items[0].item.op.attributes[key]; }) || '';
                indent = parseInt(cv.items[0].item.op.attributes[attrKey]['wrapper-indent'], 10);
            }
            else {
                indent = cv.items[0].item.op.attributes.indent;
            }
            if (indent) {
                pv[indent] = pv[indent] || [];
                pv[indent].push(cv);
            }
            return pv;
        }, {});
    };
    ListNester.prototype.placeUnderParent = function (target, items) {
        for (var i = items.length - 1; i >= 0; i--) {
            var elm = items[i];
            if (target.items[0].item.op.hasHigherIndentThan(elm.items[0].item.op, this.blocksCanBeWrappedWithList)) {
                var parent = elm.items[elm.items.length - 1];
                if (parent.innerList) {
                    parent.innerList.items = parent.innerList.items.concat(target.items);
                }
                else {
                    parent.innerList = target;
                }
                return true;
            }
        }
        return false;
    };
    return ListNester;
}());
exports.ListNester = ListNester;
