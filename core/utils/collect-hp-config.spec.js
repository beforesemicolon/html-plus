const {collectHPConfig} = require('./collect-hp-config');
const hpConfig  = require('./../../hp.config');

describe('collectHPConfig', () => {
  it('should return default hp config', () => {
    expect(collectHPConfig()).toEqual(hpConfig);
  });
  
  it('should return hp config with added option', () => {
    expect(hpConfig.env).toEqual('test');
    expect(collectHPConfig({env: 'development'})).toEqual({...hpConfig, env: 'development'});
  });
});
