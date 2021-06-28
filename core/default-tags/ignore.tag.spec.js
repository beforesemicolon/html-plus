const {transform} = require('./../transform');

describe('Ignore Tag', () => {
  describe('should not bind data', () => {
    it('when no value', () => {
      const str = '<ignore><b>{sample}</b></div>'
      
      expect(transform(str)).toEqual('<b>{sample}</b>');
    });
    
    it('with value', () => {
      const str = '<ignore value="$data.content"><b>{sample}</b></ignore>'
      
      expect(transform(str, {
        data: {
          content: '<p>Sample</p>'
        }
      })).toEqual('<b>{sample}</b><p>Sample</p>');
    });
  });
  
  it('should escape html', () => {
    const str = '<ignore escape><b>{sample}</b></div>'
    
    expect(transform(str, {
      data: {
        content: '<p>Sample</p>'
      }
    })).toEqual('&lt;b&gt;{sample}&lt;/b&gt;');
  });
});