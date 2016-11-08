"use strict";
let debug = Debug('pages:hello')

SIO.on('hello', function(data, socket) {
    var _io = this.io,
        _id = socket.id
    if (typeof data === 'string') {
        if (data === 'hi') {
            socket.emit('hello', {
                user: 'FKPJS',
                message: `HELLO <br/> 我是websocket的数据`
            })
        }
    }
})

function hello(oridata) {
  return {
    get: async function(ctx){
      // let xxx = await Fetch.get('163')
      // console.log(xxx);

      let fdocsHome = await ctx.fkp().docs('fdocs', 'mdhome')
      oridata = _.extend(oridata, fdocsHome)
      oridata.fkp = 'FKP2'
      return oridata;
    },

    post: async function(ctx){
      return {pdata: '我是post数据'}

    }
  }
}

export { hello as getData }