"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseComponent = /** @class */ (function () {
    function BaseComponent() {
    }
    BaseComponent.prototype.__report = function (reportData) {
        if (process && process.send) {
            var name_1 = reportData.name, content = reportData.content, access = reportData.access;
            process.send({
                action: 'resource',
                data: {
                    name: name_1,
                    access: access,
                    content: JSON.stringify(content),
                },
            });
            return content;
        }
    };
    return BaseComponent;
}());
exports.default = BaseComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tb24vYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0lBQUE7SUFlQSxDQUFDO0lBZFcsZ0NBQVEsR0FBbEIsVUFBbUIsVUFBMkM7UUFDNUQsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLElBQUksRUFBRTtZQUNuQixJQUFBLE1BQUksR0FBc0IsVUFBVSxLQUFoQyxFQUFFLE9BQU8sR0FBYSxVQUFVLFFBQXZCLEVBQUUsTUFBTSxHQUFLLFVBQVUsT0FBZixDQUFnQjtZQUM3QyxPQUFPLENBQUMsSUFBSSxDQUFDO2dCQUNYLE1BQU0sRUFBRSxVQUFVO2dCQUNsQixJQUFJLEVBQUU7b0JBQ0osSUFBSSxRQUFBO29CQUNKLE1BQU0sUUFBQTtvQkFDTixPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7aUJBQ2pDO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxPQUFPLENBQUM7U0FDaEI7SUFDSCxDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBZkQsSUFlQyJ9