const {extractExecutableSnippetFromString, findCode} = require('./extract-executable-snippet-from-string');

describe('extractExecutableSnippetFromString', () => {
  it('should extract executable snippets', () => {
    expect.assertions(6);
    
    expect(
      extractExecutableSnippetFromString('{1 + 1}')
    ).toEqual([{executable: "1 + 1", match: "{1 + 1}"}]);


    expect(
      extractExecutableSnippetFromString('{1 + 1}-{2 + 2}')
    ).toEqual([
      {
        executable: "1 + 1",
        match: "{1 + 1}"
      },
      {
        executable: "2 + 2",
        match: "{2 + 2}"
      }
    ]);

    expect(
      extractExecutableSnippetFromString('{1 + 1} {name + "sample"}')
    ).toEqual([
      {executable: "1 + 1", match: "{1 + 1}"},
      {executable: "name + \"sample\"", match: "{name + \"sample\"}"}
    ]);

    expect(
      extractExecutableSnippetFromString('{{name: "test"}}')
    ).toEqual([
      {executable: '{name: "test"}', match: '{{name: "test"}}'}
    ]);

    expect(extractExecutableSnippetFromString(`{list.push({name: "sample"})}{{sample: 12}}{name}`))
      .toEqual([
        {
          executable: "list.push({name: \"sample\"})",
          match: "{list.push({name: \"sample\"})}"
        },
        {
          executable: "{sample: 12}",
          match: "{{sample: 12}}"
        },
        {
          executable: "name",
          match: "{name}"
        }
      ]);

    expect(
      extractExecutableSnippetFromString('({n})')
    ).toEqual([
      {
        "executable": "n",
        "match": "{n}"
      }
    ]);
    
  });
  
  it('should ignore escaped curly braces', () => {
  
  });
});