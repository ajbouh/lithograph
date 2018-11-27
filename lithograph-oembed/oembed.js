const { data, union, number, parameterized } = require("@algebraic/type");
const { Set } = require("@algebraic/collections");
const fromTable = require("@lithograph/plugin/from-table");
const { Failure } = require("@lithograph/remark/parse-type");
const Section = require("@lithograph/ast/section");
const MDList = require("@lithograph/remark/md-list");

const Format = union `Format` (
    data `JSON` (),
    data `XML` () );

const OEmbedConfiguration = data `OEmbedConfiguration` (
    formats => Set(Format),
    maxwidths => Set(number) );


module.exports = function OEmbedPlugin(list)
{
    const table = list.next.node;
    const configuration = fromTable(OEmbedConfiguration, table);

    if (parameterized.belongs(Failure, configuration))
        throw TypeError(configuration.message);

    const { formats, maxwidths } = configuration;

    console.log(configuration);
    console.log(Section.from(MDList.toArray(list.next.next)));
/*
    const args = fromTable(OEmbedArguments, elements[0]);

    console.log(args);
    console.log(elements);

    return `# A simple test`;*/

    return list.next;
}



