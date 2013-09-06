var content = "";
var operations = [];

var id = {};
var program = {};

function processMute() {
    content = $("#inputArea").val();

    operations = content.split("\n");
    // Remove nil Lines ( "" )
    for (var i = 0; i < operations.length; i++) {
        if (operations[i] === "") {
            delete operations[i];
        }
    }


    function resolve(run) {
        var varRegex = /[^a-z0-9.$]/i;
        var operRegex = /[a-z0-9.$]/i;

        run["cond_variables"] = run["cond"].split(varRegex);
        run["cond_operators"] = run["cond"].split(operRegex);

        var first = renderValue(run["cond_variables"][0]);
        var second = renderValue(run["cond_variables"][1]);
        var operator = run["cond_operators"][0];

        var resolving;
        switch (operator) {
            case ">":
                resolving = first > second;
                break;
            case "<":
                resolving = first < second;
                break;
            case "=":
                resolving = first === second;
                break;
        }

        if(run["cond_variables"].length < 2 && first > 0) {
            resolving = 1;
        }

        if (resolving || !run["cond"]) {
            return true;
        } else {
            return false;
        }
    }

    function renderString(operation) {
        var string = operation.match(/"([^"]+)"/);
        string = string[1];

        var replacements = operation.replace("\"" + string + "\",", "");
        replacements = replacements.split(",");

        for (var i = 0; i < replacements.length; i++) {
            replacements[i] = renderValue(replacements[i]);
        }

        var result = strig.replace(Array("@1","@2","@3"), replacements);
        return result;
    }

    function operate(operation) {
        if (operation.charAt(0) === "\"") {
            console.log(renderString(operation));
        } else {
            program = update(operation);
            interpreter(id);
        }
    }

    function interpreter(id) {
        if (resolve(program[id]) && (program[id] = "oper")) {
            operate(program[id] = "oper");
        }
    }

    for (var j = 0; j < operations.length; j++) {
        console.log("Line: " + j);
        var value = operations[j];
        var pattern = /[^a-z0-9]/i;
        id = value.split(pattern);
        id = id[0];
        update(value);
        interpreter(id);
    }
    
    function update(value) {
        var pattern = /[^a-z0-9]/i;
        id = value.split(pattern);
        id = id[0];

        var attr = value.match(/\[(.*?)\]/);
        if (attr) {
            attr = attr[1];
        }
        var cond = value.match(/\((.*?)\)/);
        if (cond) {
            cond = cond[1];
        }
        var oper = value.match(/\{(.*?)\}/);
        if (oper) {
            oper = oper[1];
        }
        id.toString();
        program[id] = {"name": id};
        if (attr) {
            program[id] = {"attr": update_attr(attr)};
        }
        if (cond) {
            program[id] = {"cond": cond};
        }
        if (oper) {
            program[id] = {"oper": oper};
        }
        console.log(program);

    }

    function update_attr(attr) {
        var temp = attr.split(",");

        for (var i = 0; i < temp.length; i++) {
            console.log("Attr: " + i);
            temp[i] = renderValue(temp[i]);
        }
        return temp;
    }

    function renderValue(val) {
        if (!val) {
            return null;
        }

        var modRegex = /[a-z0-9.$]/i;
        var attrMods = val.split(modRegex);
        var modifier = attrMods[1];
        var contRegex = /[^a-z0-9.$]/i;
        var attrContent = val.split(contRegex);
        var key = dotValue(attrContent[0]);
        var index = dotValue(attrContent[1]);

        // Random
        if (val.indexOf("~") !== -1) {
            console.log("Rand:", key, index);
            return randomFromInterval(key, index);
        }

        // Length
        if (val.indexOf(";") !== -1) {
            console.log("Length: ", program[key] = {"attr": 0}.length);
            return key.length;
        }

        // Merge
        if (val.indexOf("&") !== -1) {
            console.log("Merge: " + key, index);
            return key.toString() + index.toString();
        }

        // Combine
        if (val.indexOf("+")!== -1) {
            console.log("Add: ", key, index);
            return key + index;
        }

        //TODO: Index
        if (val.indexOf(":") !== -1) {
            console.log("ERROR: Index not (jet) implemented.");
        }

        // Default
        if (program[key] = {"attr": index} && attrMods.length < 1) {
            console.log("Get: ", key, index);
            return program[key] = {"attr": index};
        }

        // Return
        return val;
    }

    function dotValue(dotvalue) {
        if (dotvalue) {
            if (dotvalue.indexOf(".") !== -1) {
                var elements = dotvalue.split(".");
                var key = elements[0];
                var index = elements[1];

                console.log("Get: " + key, index);
                if (program[key]["attr"][index]) {
                    return program[key] = {"attr": index};
                }
            } else if (program[dotvalue] = {"attr": 0}) {
                return program[dotvalue] = {"attr": 0}
            }
            return dotvalue;
        }
        return dotvalue;

    }

    // From http://stackoverflow.com/questions/4959975/generate-random-value-between-two-numbers-in-javascript
    function randomFromInterval(from,to)
    {
        return Math.floor(Math.random()*(to-from+1)+from);
    }

}