import {wrapItem, grids} from 'component/client'

const Buton = wrapItem(<button className='btn'>haha</button>, function(dom){
  $(dom).click(function(){
    Grids.g1.replace('abccccc')
  })
})

const autoinject
const Grids = {
  g1: grids({ autoinject }),
  g2: grids({ autoinject })
}

const container = (
  <div className="boxer">
    <Grids.g1.x data={[<span>111</span>,'2']} />
    <Buton />
    <Grids.g2.x data={['4','5']} />
  </div>
)

React.render(container, document.querySelector('#test'))