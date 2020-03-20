This is a collection of utility classes used for JS development.

 1. <a name="cusage"></a>[Usage](#usage)
 2. <a name="cversionHistory"></a>[Version history](#versionHistory)

### <a name="usage"></a>[Usage](#cusage)
 1. <a name="carrayStringifier"></a>[ArrayStringifier](#arrayStringifier)
 2. <a name="cdottedStringObject"></a>[DottedStringObject](#dottedStringObject)
 3. <a name="cstaticUtils"></a>[StaticUtils](#staticUtils)

#### <a name="arrayStringifier"></a>[ArrayStringifier](#carrayStringifier)

Given an array, produces its string representation.

    import { ArrayStringifier } from "simple-common-utils"; 

 - constructor()

    Constructs a class instance.
    
        new ArrayStringifier(array);

    gives exactly the same result as
    
        new ArrayStringifier()
            .setArray(array)
            .setSeparator(", ");

 - process() / toString()

    Returns a string representation of the array.

The following methods return `this` for method chaining.

 - setPrefix()
    
    Sets a prefix to be added to the resulting string.
    
        arrayStringifier.setPrefix(
            prefix, // String.
            addIfArrayLength // Boolean. If true the prefix will be added ONLY if the array is not empty. Default: true.
        );

 - setArray()

    Sets an array to stringify.

        arrayStringifier.setArray(array);

 - setSeparator()

    Sets a separator to be used.
    
        arrayStringifier.setSeparator(
            separator // String
        );

 - setElementProcessor()

    Sets an element processor for fine-grained per-element processing. An element processor is a function the return value of which will be used to determine the value and optionally the separator for the current array element. If an element processor returns an object with methods `getElement()` and  `getSeparator()` they will be used to get the value and the separator for the current array element. If the method `getElement()` is not present in the return value, the latter will be used as the value for the current array element as is and the separator set by `setSeparator()` will be used.

        const arrayStringifier = new ArrayStringifier();
        
        arrayStringifier
            .setArray([1, 2, 3, 4])
            .setElementProcessor(element => element % 2 ? "Something odd" : element)
            .process(); // Something odd, 2, Something odd, 4
        
        arrayStringifier
	        .setArray([1, 2, 3, 4])
	        .setElementProcessor(element => !(element % 2) ? element : element == 1 ? {
	            getElement() {
	                return "";
	            },
	            getSeparator() {
	                return "";
	            }
	        } : "Something odd")
	        .process(); // 2, Something odd, 4

 - setPostfix()

    Sets a postfix to be added to the resulting string.
    
        arrayStringifier.setPostfix(
            postfix, // String.
            addIfArrayLength // Boolean. If true the postfix will be added ONLY if the array is not empty. Default: true.
        );

#### <a name="dottedStringObject"></a>[DottedStringObject](#cdottedStringObject)

Provides a way to get and set objects properties with dot separated strings. All methods are `static`.

    import { DottedStringObject } from "simple-common-utils";

 - getProperty()

    Gets a property value.

        DottedStringObject.getProperty(
            object, // Object.
            fullPropertyName, // String. A dot separated full property name.
            defaultValue // Object. This value is returned if the property doesn't exist.
        );

    Example:
        
        const const obj = {
            f1: 10,
            obj1: {
                f1: 20
            }
        };
        
        DottedStringObject.getProperty(obj, "f1"); // 10
        DottedStringObject.getProperty(obj, "f1", "aaa"); // 10
        DottedStringObject.getProperty(obj, "obj1.f1"); // 20
        DottedStringObject.getProperty(obj, "obj1.f2", "default"); // default

 - setProperty()

    Sets a property value.

        DottedStringObject.setProperty(
            object, // Object.
            fullPropertyName, // String. A dot separated full property name.
            value // Object. A value to set.
        );

    Example:

        const obj = {};
        
        DottedStringObject.setProperty(obj, "f1", 10); // { f1: 10 }
        DottedStringObject.setProperty(obj, "obj1", 20); // { f1: 10, obj1: 20 }
        DottedStringObject.setProperty(obj, "obj1", {}); // { f1: 10, obj1: {} }
        DottedStringObject.setProperty(obj, "obj1.f2", 30); // { f1: 10, obj1: { f2: 30 } }

#### <a name="staticUtils"></a>[StaticUtils](#cstaticUtils)

A collection of different utility methods. All the methods in this class are `static`.

    import { StaticUtils } from "simple-common-utils";

 - round()

    Rounds `value` to `decimals` digits after the decimal point (thanks, [MarkG](https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary)!). `symmetric` is used to achieve the same functionality both for negative and positive numbers.

        StaticUtils.round(value, decimals, symmetric);

        StaticUtils.round(10.2); // 10.2
        StaticUtils.round(10.2, 0); // 10
        StaticUtils.round(10.5, 0); // 11
        StaticUtils.round(10.523, 1); // 10.5
        StaticUtils.round(10.525, 2); // 10.53
        StaticUtils.round(-1.5, 0); // -1
        StaticUtils.round(-1.5, 0, true); // -2

 - encodedUtf8ToByteArray()

    Converts the passed utf8-encoded string to a byte array.
    
        import utf8 from "utf8";
        
        StaticUtils.encodedUtf8ToByteArray(
            utf8.encode("abcфыва")); // [ 97, 98, 99, 209, 132, 209, 139, 208, 178, 208, 176 ]

 - ensureBounds()

    Ensures `min <= value <= max`.

        StaticUtils.ensureBounds(value, min, max);
        
        StaticUtils.ensureBounds(10, 2, 18); // 10
        StaticUtils.ensureBounds(100, 2, 18); // 18
        StaticUtils.ensureBounds(100, 200, 1800); // 200

 - pushAndReturnElement()

    Pushes `element` to `array` and returns `element`.

        StaticUtils.pushAndReturnElement(array, element);

 - quoteIfString()

   Quotes `value` if it's a string, using `quotingSymbol`.

        StaticUtils.quoteIfString(10); // 10
        StaticUtils.quoteIfString("10"); // "10"
        StaticUtils.quoteIfString("10", "'"); // '10'

 - safeQuoteIfString()

    Invokes `quoteIfString()` passing `value` and `quotingSymbol` to it if `quoteIfString` is `true`.

        StaticUtils.safeQuoteIfString(value, quoteIfString, quotingSymbol);

 - objectToArray()

    Converts `object` to an array and returns it. Nested objects are **not** parsed.

        StaticUtils.objectToArray({a: "10", b: 20}); // [ '10', 20 ]
        StaticUtils.objectToArray({a: "10", b: 20, c: {a: 10}}); //  [ '10', 20, { a: 10 } ]

The code is taken from [here](https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript) for the next two methods.

 - escapeRegExp()

   Given a string, escapes all occurences of symbols that have special meaning in regular expressions.

        StaticUtils.escapeRegExp("a"); // a
        StaticUtils.escapeRegExp("*a^"); // \*a\^

 - replaceAll()

    Implements a "replace all" functionality for a string.

        StaticUtils.replaceAll("abc", "b", "10"); // a10c
        StaticUtils.replaceAll("a^b*c", "^b", "10"); // a10*c

 - deg2Rad()

    Converts degrees to radians.

 - color()

        StaticUtils.color("pink"); // 0xffc0cb00
        
        StaticUtils.color("non-existent-color"); // undefined
        
        StaticUtils.color(123); // 123

 - random()

    Generates a random number using `Math.random()`.

        StaticUtils.random(1.5, 2.5); // A random number between 1.5 and 2.5.
        
        StaticUtils.random(10, 12, true); // An integer random number in the half-open range [10, 12).
        
        StaticUtils.random(10, 12, true, true); // An integer random number in the closed-range [10, 12].

 - verify(condition, errorMessage)

    Evaluates the passed boolean `condition` and throws an error with the `errorMessage` text if `condition` is false.

### <a name="versionHistory"></a>[Version history](#cversionHistory)

Version number|Changes
-|-
v2.2.0|`./js/processing-queue/` classes are added.
v2.1.1|1. `StaticUtils.verifyPropertyPresence()` behaved incorrectly if a field being verified was `null` or `undefined`. Fixed.<br>2. Final stops removed from `throw` messages.
v2.1.0|`StaticUtils.verifyPropertyPresence()` / `StaticUtils.verifyPropertyAbsence()` are added.
v2.0.0|Backwards-incompatible changes in `data-transmission-protocol` classes:<br>1. `Packet.constructor()` changed and `Packet.wrap()` added.<br>2. `Format` is filled dynamically: it's necessary to import relevant format-defining classes.
v1.7.1|Autobinding removed from the `data-transmission-protocol` classes.
v1.7.0|`data-transmission-protocol`-classes added. These deprecate `zx55`.
v1.6.0|`zx55` added.
v1.5.1|`quotingSymbol` is added to `StaticUtils.quoteIfString() / safeQuoteIfString()`.
v1.4.1|The method `StaticUtils.verify()` is added.
v1.2.1|`StaticUtils.colorNames` had `00` as alpha. Changed to `FF`.
v1.2.0|The parameter `symmetric` is added to `StaticUtils.round()` in a backwards-compatible way.
v1.1.0|The methods `StaticUtils.deg2Rad()` and `StaticUtils.color()` are added.
v1.0.0|Initial release.
<br><br>
> Written with [StackEdit](https://stackedit.io/).
