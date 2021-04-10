let ho ;
function setupho (){
 let homedges = new Array();
 homedges.push ( new Zone ( createVector ( .8 , .8 ), createVector ( 8 , 8 )) );
 ho = new House ( rooms , homedges );
}
function setuphoinedges (  homedges ){
 ho = new House ( rooms , homedges );
}
function setuptr (){
 ho.setuptr ( lockgenes );
}
function setupid (){
 ho.setupid ();
}
function setupdraw (){  
 ho.setupdraw ();
}
function setupga (){
 ho.setuphoga ();
}

function drawho (){ 
 if (! dr.state ) ho.displayhouse ();//  button.style(background-color,col);
 if (! dr.state ) scoreshow ( createVector ( width * .75 -( 50 * scand )-60, 20 * scand ), createVector ( 100 * scand , 10 * scand ), int (( 10 - ho.totfit )* 10 ), 150 , 255 );
 button = createImg("https://image.flaticon.com/icons/png/512/51/51092.png");
 button.position(830, 100);  
 button.style("background-color","#E5DFDF");
 button.style("cursor","pointer");
 button.style("width","30px")
 button.style("height","30px")
//  button.style("border","2px solid grey");
 button.style("border-radius","100px");
 button.style("text-align","center");
 button.style("font-family","Arial");
 button.style("font-size","small");
 button.style("display","inline-block");
 button.style("color","grey");
 button.style("padding","0px 0px");
 button.mousePressed(()=>{
   saveCanvas('FloorPlan','png')
   return false;
 });
}



function pressho (){
 ho.press ();
}
function typeho (){
 ho.type ();
}
class House {
 constructor (   _rooms  ,  _homedges ){
   rooms ;
  this.permgene , this.locgene , this.subgene , this.totfit ;
  this.no ;
  this.nrooms , this.ngenes ;
  this.treesize = createVector ( 180 * scand , 30 * scand );
  this.treepos = createVector ( 600 * scand , 250 * scand );
  this.homedges ;
   this.ng ;
  this.p ;
   this.at ;
  rooms = _rooms ;
  this.nrooms = rooms.length ;
  this.ngenes = min0 ( this.nrooms - 2 )+ 1 + min0 ( this.nrooms - 1 );
  this.locgene  = new Array ( min0 ( rooms.length - 2 ));
  this.subgene  = new Array ( min0 ( rooms.length - 1 ));
  this.homedges = _homedges ;
  this.ng  = new Array ( this.ngenes );
  for ( let i = getngnum ( "lmin" , this.nrooms ); i < getngnum ( "lmax" , this.nrooms ); i ++) this.ng [ i ]= new Nodegene ( "l" , 0 , false , createVector ( this.treepos.x - this.treesize.x , this.treepos.y + i * 15 * scand ));
  for ( let i = getngnum ( "pmin" , this.nrooms ); i < getngnum ( "pmax" , this.nrooms ); i ++) this.ng [ i ]= new Nodegene ( "p" , 0 , false , createVector ( this.treepos.x - this.treesize.x , this.treepos.y + i * 15 * scand ));
  for ( let i = getngnum ( "smin" , this.nrooms ); i < getngnum ( "smax" , this.nrooms ); i ++) this.ng [ i ]= new Nodegene ( "s" , 0 , false , createVector ( this.treepos.x - this.treesize.x , this.treepos.y + i * 15 * scand ));
  this.insertgenes ( ranflarr ( this.ngenes , 0 , 1 ));
 }

  

  clonenewgenes (   genes ){  
  let clone = new House ( clonestarr ( rooms ), clonezonelist ( this.homedges ));
  clone.ng = clonengarrwithgenes ( this.ng , genes );
  clone.setuptr ( lockgenes );
  clone.setupid ();
  clone.setupdraw ();
  return clone ;
 }
  setuptr (   lockgenes ){
  this.insertbgenes ( lockgenes );
  this.calctree ();
  this.calcrela ();
 }
  setupid (){
  this.calcideal ();
  this.calchouse ();
 // this.strechzones ();
  this.calcborders ();
  this.calcreals ();
  this.calcsubparamminmax ();
  this.calchouse ();
 // this.strechzones ();
  this.calcborders ();
  this.calcreals ();
  this.calcfit ();
 }
  setupdraw (){
  this.calcbordertypes ();
  this.calcmuebles ();
 }
  insertgenes (  geneins ){ 
  if ( geneins.length < this.ng.length ) for ( let i = 0 ; i < geneins.length ; i ++) if (! this.ng [ i ] .inactive ) this.ng [ i ] .value = geneins [ i ];
  if ( geneins.length >= this.ng.length ) for ( let i = 0 ; i < this.ng.length ; i ++) if (! this.ng [ i ] .inactive ) this.ng [ i ] .value = geneins [ i ];
 }
  insertbgenes (  genebins ){ 
  if ( genebins.length < this.ng.length ) for ( let i = 0 ; i < genebins.length ; i ++) this.ng [ i ] .inactive = boolean ( genebins [ i ]);
  if ( genebins.length >= this.ng.length ) for ( let i = 0 ; i < this.ng.length ; i ++)  this.ng [ i ] .inactive = boolean ( genebins [ i ]);
 } 
  calctree (){
  this.no = nodecrea ( rooms , ngvalues ( this.ng , getngnum ( "lmin" , this.nrooms ), getngnum ( "lmax" , this.nrooms )) );
  for ( let n = 0 ; n < this.no.length ; n ++) if ( this.no [  n ] .isleaf ) this.no [  n ] .code = permutation01 ( rooms , ngvalue ( this.ng , getngnum ( "pmin" , this.nrooms )) )[ this.no [  n ] .leafi ];
  for ( let n = 0 ; n < this.no.length ; n ++) if (! this.no [  n ] .isleaf ) this.no [  n ] .subparam [ 0 ]= roundit ( ngvalue ( this.ng , this.no [  n ] .inneri + getngnum ( "smin" , this.nrooms )), 2 )+ "" ;
  for ( let n = 0 ; n < this.no.length ; n ++) if (! this.no [  n ] .isleaf ) this.ng [ this.no [  n ] .inneri + getngnum ( "smin" , this.nrooms )] .loc = this.no [  n ] .loc ;// nombrar loc de ngs
  for ( let n = 0 ; n < this.no.length ; n ++) this.no [  n ] .ischilda = ifischilda ( this.no [  n ] .loc );
  for ( let n = 0 ; n < this.no.length ; n ++) this.no [  n ] .calcnodepos ( this.treepos , this.treesize );
 }
  calcrela (){
  for ( let n = 0 ; n < this.no.length ; n ++) this.no [  n ] .father = calcrelative ( this.no [  n ], this.no , "father" );
  for ( let n = 0 ; n < this.no.length ; n ++) this.no [  n ] .childa = calcrelative ( this.no [  n ], this.no , "childa" );
  for ( let n = 0 ; n < this.no.length ; n ++) this.no [  n ] .childb = calcrelative ( this.no [  n ], this.no , "childb" );
  for ( let n = 0 ; n < this.no.length ; n ++) this.no [  n ] .brother = calcrelative ( this.no [  n ], this.no , "brother" );
 }
  calcideal (){
  for ( let n = 0 ; n < this.no.length ; n ++) if ( this.no [  n ] .isleaf ) for ( let i = 0 ; i < this.no [  n ] .ideals.length ; i ++) this.no [  n ] .ideals [ i ]= roomideals ( this.no [  n ] .code , i , roomDATA );// 0:Code , 1:Name 2:area 3:minW 4:maxW 5:prop 6:conect
  for ( let n = this.no.length - 1 ; n >= 0 ; n --) if (! this.no [  n ] .isleaf ) this.no [  n ] .ideals [ 2 ]=( float ( this.no [  n ] .childa.ideals [ 2 ])+ float ( this.no [  n ] .childb.ideals [ 2 ]))+ "" ;
  for ( let n = 0 ; n < this.no.length ; n ++) if ( this.no [  n ] .father != null ) this.no [  n ] .subparam [ 1 ]= roundit ( float ( this.no [  n ] .ideals [ 2 ])/ float ( this.no [  n ] .father.ideals [ 2 ]), 2 )+ "" ;
 }
  calchouse (){
  this.no = calcallzones ( this.no , this.homedges );
 }
  calcborders (){
  for ( let n = 0 ; n < this.no.length ; n ++) for ( let z = 0 ; z < this.no [  n ] .zones.length ; z ++) this.no [  n ] .zones [  z ] .borders = borderDEzones ( this.no [  n ] .zones [  z ], this.no );
 }
  calcreals (){// 0 :code 1:name 2: area 3:minW
  for ( let n = 0 ; n < this.no.length ; n ++) if ( this.no [  n ] .isleaf ) for ( let z = 0 ; z < this.no [  n ] .zones.length ; z ++) this.no [  n ] .reals [ 2 ]= nf ( this.no [  n ] .zones [  z ] .area (), 1 , 2 )+ "" ;// area
  for ( let n = 0 ; n < this.no.length ; n ++) if ( this.no [  n ] .isleaf ) if ( this.no [  n ] .zones.length > 0 ) this.no [  n ] .reals [ 6 ]= nf ( this.no [  n ] .zones [  0 ] .zwidth (), 1 , 2 )+ "" ;    // minwidth
  for ( let n = 0 ; n < this.no.length ; n ++) if ( this.no [  n ] .isleaf ) if ( this.no [  n ] .zones.length > 0 ) this.no [  n ] .reals [ 7 ]= nf ( this.no [  n ] .zones [  0 ] .zwidth (), 1 , 2 )+ "" ;    // maxwidth
  for ( let n = 0 ; n < this.no.length ; n ++) if ( this.no [  n ] .isleaf ) for ( let z = 0 ; z < this.no [  n ] .zones.length ; z ++) for ( let b = 0 ; b < this.no [  n ] .zones [  z ] .borders.length ; b ++) this.no [  n ] .zones [  z ] .borders [  b ] .adj = caldadjborder ( this.no [  n ] .zones [  z ] .borders [  b ], this.no );
  for ( let n = 0 ; n < this.no.length ; n ++) if ( this.no [  n ] .isleaf ) this.no [  n ] .reals [ 9 ]= adjlist ( this.no , this.no [  n ]);                  // reals adjlist
  for ( let n = 0 ; n < this.no.length ; n ++) if ( this.no [  n ] .isleaf ) if ( this.no [  n ] .zones.length > 0 ) this.no [  n ] .reals [ 8 ]= nf ( this.no [  n ] .zones [  0 ] .prop (), 1 , 2 )+ "" ;
 }
  strechzones (){
  scaleno ( this.no , calcstrechfactor ( this.no ));
  gridno ( this.no );
 // removeemptyzones ( this.no );
 }
  calcbordertypes (){
  for ( let n = 0 ; n < this.no.length ; n ++) if ( this.no [  n ] .isleaf ) for ( let z = 0 ; z < this.no [  n ] .zones.length ; z ++) for ( let b = 0 ; b < this.no [  n ] .zones [  z ] .borders.length ; b ++) this.no [  n ] .zones [  z ] .borders [  b ] .id [ 4 ]= calcbordertype ( this.no , this.no [  n ], this.no [  n ] .zones [  z ] .borders [  b ]);                  // entry
  for ( let n = 0 ; n < this.no.length ; n ++) if ( this.no [  n ] .isleaf ) calcbordertyperoom ( this.no , this.no [  n ]);
 }
  calcmuebles (){
  for ( let n = 0 ; n < this.no.length ; n ++) if ( this.no [  n ] .isleaf ) if ( this.no [  n ] .zones.length > 0 ) this.no [  n ] .muebles = calcmuebleslist (( this.no [  n ]) );
 }
  recalc0zones (){
  for ( let n = 0 ; n < this.no.length ; n ++) if ( this.no [  n ] .isleaf ) if ( this.no [  n ] .zones.length > 0 ) if ( this.no [  n ] .zones [  0 ] .xdim ()== 0 ) if ( ischildx ( float ( this.no [  n ] .father.subparam [ 0 ])) ){
  let newper = grunit / this.no [  n ] .father.zones [  0 ] .xdim ();
  this.no [  n ] .subparam [ 1 ]= newper + "" ;
  this.no [  n ] .brother.subparam [ 1 ]=( 1 - newper )+ "" ;
 }
  for ( let n = 0 ; n < this.no.length ; n ++) if ( this.no [  n ] .isleaf ) if ( this.no [  n ] .zones.length > 0 ) if ( this.no [  n ] .zones [  0 ] .ydim ()== 0 ) if (! ischildx ( float ( this.no [  n ] .father.subparam [ 0 ])) ){
  let newper = grunit / this.no [  n ] .father.zones [  0 ] .ydim ();
  this.no [  n ] .subparam [ 1 ]= newper + "" ;
  this.no [  n ] .brother.subparam [ 1 ]=( 1 - newper )+ "" ;
 }
 }
  calcsubparamminmax (){
  for ( let n = 0 ; n < this.no.length ; n ++) if ( this.no [  n ] .isleaf ) if ( this.no [  n ] .zones.length > 0 ) if ( float ( this.no [  n ] .ideals [ 7 ])< float ( this.no [  n ] .reals [ 7 ])||( float ( this.no [  n ] .ideals [ 6 ])> float ( this.no [  n ] .reals [ 6 ])) ){
 // if ( float ( this.no [  n ] .ideals [ 6 ])> float ( this.no [  n ] .reals [ 6 ])) print ( this.no [  n ] .ideals [ 0 ]+ ": width too small" );
 // if ( float ( this.no [  n ] .ideals [ 7 ])< float ( this.no [  n ] .reals [ 7 ])) print ( this.no [  n ] .ideals [ 0 ]+ ": width too big" );
  let childx = ischildx ( float ( this.no [  n ] .father.subparam [ 0 ]));
  let lengthisx = this.no [  n ] .zones [  0 ] .lengthisx (); 
  if (( childx &&! lengthisx )||(! childx && lengthisx )){
   let newper = roundit ( float ( this.no [  n ] .ideals [ 6 ])/ this.no [  n ] .father.zones [  0 ] .xdim (), 2 );
   this.no [  n ] .subparam [ 1 ]= newper + "" ;
   this.no [  n ] .brother.subparam [ 1 ]=( 1 - newper )+ "" ;
 }
 }
 }
  calcfit (){
  this.totfit = 0 ;
  this.totfit += calctotpropfit ( this.no , 5 );
  this.totfit += calctotadjfit ( this.no , 50 );
  this.totfit += calcmissingzonesfit ( this.no , 300 );
  this.totfit += calcclosetinbetween ( this.no , 1000 );
 }
  displaytree (){
  for ( let n = 0 ; n < this.ng.length ; n ++) this.ng [ n ] .display ();
  for ( let n = 0 ; n < this.no.length ; n ++) this.no [  n ] .displaynodetree ();
  fill ( 255 , 0 , 0 );
  text ( this.totfit , this.treepos.x , this.treepos.y - 20 );
 }
  displayhouse (){
 // for ( let h = 0 ; h < this.homedges.length ; h ++) this.homedges [  h ] .displaycolor ();
  for ( let n = 0 ; n < this.no.length ; n ++) this.no [  n ] .displaymuebles ();
  for ( let n = 0 ; n < this.no.length ; n ++) this.no [  n ] .displayrooms ();
 }
  press (){
  for ( let i = 0 ; i < this.ng.length ; i ++) this.ng [ i ] .press ();
 }
  type (){
  if ( key == 'q' ) for ( let n = 0 ; n < this.ng.length ; n ++ ) this.ng [ n ] .scroll ( true );
  if ( key == 'w' ) for ( let n = 0 ; n < this.ng.length ; n ++ ) this.ng [ n ] .scroll ( false );
  if ( key == 'a' ) for ( let n = 0 ; n < this.ng.length ; n ++ ) this.ng [ n ] .activateit ( true );
  if ( key == 'q' || key == 'w' ) this.setuptr ( lockgenes );
  if ( key == 'q' || key == 'w' ) this.setupid ();
 }
  setuphoga (){
  this.at  = new Array ( this.ngenes );   
  for ( let i = 0 ; i < this.at.length ; i ++) this.at [ i ]= new Atribute ( "g" + i , 0 , 1 );
  let nPopX = 10 ;// 25
  let nPopY = 10 ;// 25
  let popSize = nPopX * nPopY ;
  this.p = new Population ( this , popSize , this.at );
 }
  evolvehoga (){
  this.p.evolve ( this );                          // Population Evolve ( every 10 frameCounts)
 }
  drawho1ga (  ind ){
  let temph = this.clonenewgenes ( this.p.pop [ ind ] .phenos );
  temph.displayhouse ();
 }
   clonengs (  ind ){
  let temph = this.clonenewgenes ( this.p.pop [ ind ] .phenos );
  return temph.ng ;
 }
}
function  roomcodedeDATAIN (   roomDATA ){
 let stout  = new Array ( roomDATA.length );
 for ( let i = 0 ; i < stout.length ; i ++) stout [ i ]= roomDATA [ i ][ 0 ];
 return stout ;
}
function  roomsSINroom (   roomsIN  ,  roomi ){
 let stout  = new Array ( roomDATA.length );
 let sto = new Array();
 for ( let i = 0 ; i < roomsIN.length ; i ++){
  if ( i != roomi ) sto.push ( roomsIN [ i ]);
  else sto.push ( "" );
 } 
 for ( let i = 0 ; i < sto.length ; i ++) stout [ i ]= sto [  i ];
 return stout ;
}
function roomidealadj (   rooms  ,  rcode  ,   roomDATA  ,  coladj ){
 let iout = 0 ;
 for ( let i = 0 ; i < rooms.length ; i ++) if ( txequal ( rooms [ i ], roomideals ( rcode , coladj , roomDATA )) ) iout = i ;
 return iout ;
}
function roomideals (  rcode  ,  idealnum  ,   roomDATA ){
 let stout = "0" ;
 let rfound = false ; 
 for ( let i = 0 ; i < roomDATA.length ; i ++) if ( txequal ( roomnonumber ( rcode ), roomDATA [ i ][ 0 ])){
  stout = roomDATA [ i ][ idealnum ]; 
  rfound = true ;
 }
 if (! rfound ) print ( "room not found" );
 return stout ;
}
function  roomidealsall (  rcode  ,   roomDATA ){
 let stout  = new Array ( roomDATA [ 0 ] .length );
 let rfound = false ; 
 for ( let i = 0 ; i < roomDATA.length ; i ++) if ( txequal ( roomnonumber ( rcode ), roomDATA [ i ][ 0 ])){
  stout = roomDATA [ i ]; 
  rfound = true ;
 }
 if (! rfound ) print ( "room not found" );
 return stout ;
}
function roomnonumber (  rcode ){
 let stout = "" ;
 // for ( let i = 0 ; i < rcode.length; i ++) if (! Character.isDigit ( rcode.charAt ( i )) ) stout += rcode.charAt ( i );
 for ( let i = 0 ; i < rcode.length; i ++) if (! containstext ( "0123456789" ,( rcode.charAt ( i ))+ "" )) stout += rcode.charAt ( i );
 // // for ( let i = 0 ; i < rcode.length ; i ++) if (! '0123456789'.includes ( rcode.charAt ( i )) ) stout += rcode.charAt ( i );
 return stout ;
}
function containstext (  txcheck  ,  chtocheck ){
 let cont = false ;
 for ( let i = 0 ; i < txcheck.length; i ++) if ( txcheck.charAt ( i )== chtocheck.charAt ( 0 )) cont = true ;
 return cont ;
}
function  getroomNAMES (   rooms ){ 
 let  roomDATAout  = new Array ( rooms.length );
 for ( let i = 0 ; i < rooms.length ; i ++){
  roomDATAout [ i ]= rooms [ i ];
  let count = 0 ;
  for ( let j = 0 ; j < i ; j ++) if ( txequal ( rooms [ i ], rooms [ j ])) count ++;
  if ( count > 0 ) roomDATAout [ i ]= rooms [ i ]+( count + 1 );
 }
 return roomDATAout ;
}
function  getroomDATA (   rooms  ,   roomDATAin ){ 
 let  roomDATAout  = new Array ( rooms.length );
 for ( let i = 0 ; i < rooms.length ; i ++) roomDATAout [ i ]= roomidealsall ( rooms [ i ], roomDATAin );
 return roomDATAout ;
}
function min0max1roomDATA (  cols  ,   roomDATAin  ,  min0max1 ){
 let minmaxf = float ( roomDATAin [ 0 ][ cols ]); 
 if ( min0max1 == 0 ) for ( let i = 0 ; i < roomDATAin.length ; i ++) if ( float ( roomDATAin [ i ][ cols ])< minmaxf ) minmaxf = float ( roomDATAin [ i ][ cols ]);
 if ( min0max1 == 1 ) for ( let i = 0 ; i < roomDATAin.length ; i ++) if ( float ( roomDATAin [ i ][ cols ])> minmaxf ) minmaxf = float ( roomDATAin [ i ][ cols ]);
 return minmaxf ;
}
function  getroomLOCKS (   rooms  ,   bin ){ 
 let  iout  = new Array ( 1 + min0 ( rooms.length - 2 )+ min0 ( rooms.length - 1 )); 
 for ( let i = 0 ; i < bin.length ; i ++) if ( i < rooms.length ) iout [ i ]= bin [ i ];
 return iout ;
}
function scoreshow (  pos  ,  size  ,  inscore  ,  coloron  ,  coloroff ){
 push ();
 if ( inscore < 0 ) inscore = 0 ;
 stroke ( 150 );
 fill ( coloroff );
 rect ( pos.x , pos.y , size.x , size.y , size.y / 2 );
 fill ( coloron );
 rect ( pos.x , pos.y , size.x *( inscore / 100 ), size.y , size.y / 2 );
 fill ( 150 );
 textAlign ( CENTER , BOTTOM );
 noStroke ();
 text ( "score:" + int ( inscore )+ " % " , pos.x + size.x * .5 , pos.y ); 
 pop ();
}
class Node {
 constructor (  _nodei  ,  _loc  ,  _isleaf ){
  this.code , this.loc ;
  this.nodei , this.leafi , this.inneri ;
  this.pos , this.size ;
  this.isleaf , this.ischilda ;
  this.ideals , this.reals , this.subparam ;
  this.zones ;
  this.father , this.childa , this.childb , this.brother ;
  this.muebles ;
  this.nodei = _nodei ;
  this.loc = _loc ;
  this.isleaf = _isleaf ;
  this.size = createVector ( 15 * scand , 15 * scand );
  this.ideals  = new Array ( roomDATA [ 0 ] .length );
  this.reals  = new Array ( roomDATA [ 0 ] .length );
  this.subparam  = new Array ( 2 );// 0:X or Y 1: Percentage subdivition
 }
  calcnodepos (  _treepos  ,  _treesize ){
  this.pos = locpos ( this.loc , _treepos , _treesize );
 }
  displaynodetree (){
  
  push ();
  rectMode ( CENTER );
  textAlign ( CENTER , CENTER );
  stroke ( 200 );
  noFill ();
  rect ( this.pos.x , this.pos.y , this.size.x , this.size.y , this.size.y / 4.0 );
  fill ( 0 );
  textSize ( 8 );
  if ( this.code != null ) text ( this.code , this.pos.x , this.pos.y );
  if ( this.father != null ) line ( this.pos.x , this.pos.y - this.size.y / 2 , this.father.pos.x , this.father.pos.y + this.size.y / 2 );
  if ( this.isleaf ) if ( this.ideals != null ) for ( let i = 0 ; i < this.ideals.length ; i ++) if ( this.ideals [ i ]!= null ) text ( this.ideals [ i ], this.pos.x - 10 , this.pos.y + 10 + 10 * i );
  if ( this.isleaf ) if ( this.reals != null ) for ( let i = 0 ; i < this.reals.length ; i ++) if ( this.reals [ i ]!= null ) text ( this.reals [ i ], this.pos.x + 10 , this.pos.y + 10 + 10 * i );
 // if ( this.subparam != null ) for ( let i = 0 ; i < this.subparam.length ; i ++) if ( this.subparam [ i ]!= null ) text ( this.subparam [ i ], this.pos.x + 30 * i , this.pos.y + 30 );
  pop ();
 }
  displayrooms (){
 // if ( this.isleaf ) for ( let z = 0 ; z < this.zones.length ; z ++) this.zones [  z ] .displaycolor ( this.code );
 // if ( this.isleaf ) for ( let z = 0 ; z < this.zones.length ; z ++) this.zones [  z ] .displaypoints ();
 // if ( this.isleaf ) if ( this.zones != null ) if ( this.zones.length > 0 ) if ( entry != null ) if ( entry.zones != null ) if ( entry.zones.length > 0 ) daline ( scgr ( this.zones [  0 ] .pmid ), scgr ( entry.zones [  0 ] .pmid ), 10 * scand );
  if ( this.isleaf ) if ( this.zones != null ) for ( let z = 0 ; z < this.zones.length ; z ++) if ( this.zones [  z ] .borders != null ) for ( let b = 0 ; b < this.zones [  z ] .borders.length ; b ++) this.zones [  z ] .borders [  b ] .display ();
  if ( this.isleaf ) if ( this.zones != null ) if ( this.zones.length > 0 ) this.zones [  0 ] .displaytittle ( this.code );
 }
  displaymuebles (){
  if ( this.isleaf ) if ( this.muebles != null ) for ( let m = 0 ; m < this.muebles.length ; m ++ ) this.muebles [ m ] .display ();
 }
}
function nodecrea (   rooms  ,   locgene ){
 let nout = new Array();
 let nodei = 0 ;
 if ( rooms.length == 1 ) nout.push ( new Node ( nodei , "0" , true ));
 else {
  for ( let i = 0 ; i < locgene.length + 3 ; i ++){
  if ( i == 0 ) nout.push ( new Node ( nodei , "0" , false ));
  else if ( i == 1 ) nout.push ( new Node ( nodei , "00" , true ));
  else if ( i == 2 ) nout.push ( new Node ( nodei , "01" , true ));
  if ( i == 0 || i == 1 || i == 2 ) nodei ++;
  else {
   let leafs = new Array();
   for ( let j = 0 ; j < nout.length ; j ++) if ( nout [  j ] .isleaf ) leafs.push ( nout [  j ]);
   let leafsel = leafs [  leafs.length - 1 ] .nodei ;
   if ( locgene [ i - 3 ]< 1 ) leafsel = leafs [  int ( map ( locgene [ i - 3 ], 0 , 1 , 0 , leafs.length ) )] .nodei ;
   nout [  leafsel ] .isleaf = false ;
   nout.push ( new Node ( nodei , nout [  leafsel ] .loc + "0" , true ));
   nout.push ( new Node ( nodei + 1 , nout [  leafsel ] .loc + "1" , true ));
   nodei += 2 ;
 }
 }
  let leafcount = 0 ;
  for ( let i = 0 ; i < nout.length ; i ++) if ( nout [  i ] .isleaf ){
  nout [  i ] .leafi = leafcount ;
  leafcount ++;
 }
  let innercount = 0 ;
  for ( let i = 0 ; i < nout.length ; i ++) if (! nout [  i ] .isleaf ){
  nout [  i ] .inneri = innercount ;
  innercount ++;
 }
  for ( let i = 0 ; i < nout.length ; i ++) if (! nout [  i ] .isleaf ) nout [  i ] .leafi =- 1 ;
  for ( let i = 0 ; i < nout.length ; i ++) if ( nout [  i ] .isleaf ) nout [  i ] .inneri =- 1 ;
 }
 return nout ;
}
class Nodegene {
 constructor (  _type  ,  _value  ,  _inactive  ,  _pos ){
  this.type , this.loc ;
  this.value , this.step , this.minV , this.maxV ;
  this.pos ;
  this.select , this.inactive ;
  this.size = createVector ( 15 * scand , 15 * scand );
  this.type = _type ;
  this.value = roundit ( _value , 2 );
  this.inactive = _inactive ;
  this.step = .01 ;
  this.minV = 0 ;
  this.maxV = 1 ;
  this.pos = _pos ;
 }
  cloneit (){
  let nout = new Nodegene ( this.type , this.value , this.inactive , this.pos.copy ());
  return nout ;
 }
  cloneactgene (  genevalue ){
  let nout ;
  if ( this.inactive ) nout = new Nodegene ( this.type , this.value , this.inactive , this.pos.copy ());
  else nout = new Nodegene ( this.type , genevalue , this.inactive , this.pos.copy ());
  return nout ;
 }
  display (){
  push ();
  rectMode ( CENTER );
  textAlign ( CENTER , CENTER );
  fill ( 255 );
  stroke ( 200 );
  if ( this.select ) fill ( 200 );
  if ( this.inactive && this.select ) fill ( 255 , 0 , 0 , 100 );
  if ( this.inactive &&! this.select ) fill ( 255 , 0 , 0 , 50 );
  if (! this.inactive && this.select ) fill ( 0 , 255 , 0 , 100 );
  if (! this.inactive &&! this.select ) fill ( 0 , 255 , 0 , 50 );
  rect ( this.pos.x , this.pos.y , this.size.x , this.size.y , this.size.y * .25 );
  fill ( 100 );
  text ( nf ( this.value , 0 , 2 ), this.pos.x , this.pos.y );
  text ( this.type , this.pos.x - 15 , this.pos.y );
  pop ();
 }
  isover (){
  if ( mouseX > this.pos.x -( this.size.x / 2.0 )&& mouseX < this.pos.x +( this.size.x / 2.0 )&& mouseY > this.pos.y -( this.size.y / 2.0 )&& mouseY < this.pos.y +( this.size.y / 2.0 )) return true ;
  else return false ;
 }
  press (){
  if ( this.isover ()) this.select =! this.select ;
 }
  scroll (  updown ){
  if ( this.select &&! updown && this.value < this.maxV ) this.value = roundit ( this.value + this.step , 4 );
  if ( this.select && updown && this.value > this.minV ) this.value = roundit ( this.value - this.step , 4 );
  if ( this.value < this.minV ) this.value = roundit ( this.minV , 2 );
  if ( this.value > this.maxV ) this.value = roundit ( this.maxV , 2 );
 }
  changeval (  newval ){
  if (! this.inactive ) this.value = newval ;
 }
  activateit (  act ){
  if ( act && this.select ) this.inactive =! this.inactive ;
 }
}
function  ngvalues (   ng  ,  iniv  ,  endv ){
 let fout  = new Array ( endv - iniv );
 for ( let i = 0 ; i < endv - iniv ; i ++) fout [ i ]= ng [ i + iniv ] .value ;
 return fout ;
}
function ngvalue (   ng  ,  iniv ){
 let fout = ng [ iniv ] .value ;
 return fout ;
}
class Zone {
 constructor (  _p00  ,  _p11 ){
  this.id  = new Array ( 2 );      // 0:nodei , 1:zonei
  this.pt  = new Array ( 4 );    
 // p00 , p11 , p01 , p10 ;
  this.borders ;

  this.pt [ 0 ]= _p00 ;
  this.pt [ 1 ]= _p11 ;
  this.pt [ 2 ]= createVector ( this.pt [ 0 ] .x , this.pt [ 1 ] .y );
  this.pt [ 3 ]= createVector ( this.pt [ 1 ] .x , this.pt [ 0 ] .y );
 }
  cloneit (){
  let zout = new Zone ( this.pt [ 0 ] .copy (), this.pt [ 1 ] .copy ());
  zout.id = cloneintarr ( this.id );
  zout.borders = cloneborderslist ( this.borders );
  return zout ;
 }
  clonenewpts (  newp10  ,  newp11 ){
  let zout = new Zone ( newp10 , newp11 );
  zout.id = cloneintarr ( this.id );
  zout.borders = cloneborderslist ( this.borders );
  return zout ;
 }
  pmid (){
  return createVector (( this.pt [ 0 ] .x + this.pt [ 1 ] .x )* .5 ,( this.pt [ 0 ] .y + this.pt [ 1 ] .y )* .5 );
 }
  area (){
  return abs ( this.pt [ 1 ] .x - this.pt [ 0 ] .x )* abs ( this.pt [ 1 ] .y - this.pt [ 0 ] .y );
 }
  prop (){
  if (( this.pt [ 1 ] .x - this.pt [ 0 ] .x )<( this.pt [ 1 ] .y - this.pt [ 0 ] .y )) return (( this.pt [ 1 ] .x - this.pt [ 0 ] .x )/( this.pt [ 1 ] .y - this.pt [ 0 ] .y ));
  else return (( this.pt [ 1 ] .y - this.pt [ 0 ] .y )/( this.pt [ 1 ] .x - this.pt [ 0 ] .x ));
 }
  xdim (){
  return abs ( this.pt [ 1 ] .x - this.pt [ 0 ] .x );
 }
  ydim (){
  return abs ( this.pt [ 1 ] .y - this.pt [ 0 ] .y );
 }
  lengthisx (){
  let bout = this.xdim ()>= this.ydim ();
  return bout ;
 }
  zwidth (){
  if (! this.lengthisx ()) return this.xdim ();
  else return this.ydim ();
 }
  zlength (){
  if ( this.lengthisx ()) return this.xdim ();
  else return this.ydim ();
 }
  displaypoints (){
  noStroke ();
  fill ( 255 , 0 , 0 , 100 );
  ellipse ( scgr ( this.pt [ 0 ]) .x , scgr ( this.pt [ 0 ]) .y , 5 , 5 );
  ellipse ( scgr ( this.pt [ 3 ]) .x , scgr ( this.pt [ 3 ]) .y , 5 , 5 );
  ellipse ( scgr ( this.pt [ 2 ]) .x , scgr ( this.pt [ 2 ]) .y , 5 , 5 );
  ellipse ( scgr ( this.pt [ 1 ]) .x , scgr ( this.pt [ 1 ]) .y , 5 , 5 );
 }
  displaytittle (  code ){
  push ();
  textAlign ( CENTER , CENTER );
  stroke ( 150 );
  fill ( 255 );
  if ( code.length<= 2 ) textSize ( 12 * scand );
  else textSize ( 10 * scand );
  ellipse ( scgr ( this.pmid ()) .x , scgr ( this.pmid ()) .y , 20 * scand , 20 * scand );

  fill ( 150 );
  let adjcount = 0 ;
  for ( let b = 0 ; b < this.borders.length ; b ++ ) if ( this.borders [ b ] .adj != null ) if ( this.borders [ b ] .adj.id [ 0 ]!= this.borders [ b ] .id [ 0 ]) adjcount ++;
 // text ( adjcount , scgr ( this.pmid ) .x , scgr ( this.pmid ) .y - 10 );
 // text ( nodei , scgr ( this.pmid ) .x , scgr ( this.pmid ) .y - 10 );
  noStroke ();
  if ( code != null ) text ( code , scgr ( this.pmid ()) .x , scgr ( this.pmid ()) .y );
 // if ( code != null ) if ( code.length> 2 ) text ( code.substring ( 0 , 2 ), scgr ( this.pmid ()) .x , scgr ( this.pmid ()) .y );
 // if ( code != null ) if ( code.length<= 2 ) text ( code , scgr ( this.pmid ()) .x , scgr ( this.pmid ()) .y );
  pop ();
 }
  displaycolor (  code ){
  push ();
  rectMode ( CORNERS );
  colorDEcode ( code , 50 , roomDATA );
  rect ( scgr ( this.pt [ 0 ]) .x , scgr ( this.pt [ 0 ]) .y , scgr ( this.pt [ 1 ]) .x , scgr ( this.pt [ 1 ]) .y );
  pop ();
 }
  displaycreate (){
  push ();
  strokeWeight ( 2 * scand );
  stroke ( 150 );
  strokeWeight ( 1 * scand );
  stroke ( 180 );
  hashrectangle ( this.pt [ 0 ] .x , this.pt [ 0 ] .y , this.pt [ 1 ] .x , this.pt [ 1 ] .y );
  pop ();
 }
}
function calczones (  n  ,  homedge ){
 let zo = new Array();
 if ( n.father == null ) zo = homedge ;// este deberia ser la zona 
 else {
  let father = n.father ;
  let fzones = father.zones ;
  let child1 = n.ischilda ;
  let childx = ischildx ( float ( n.father.subparam [ 0 ]));
  let subper = float ( n.subparam [ 1 ]);
  let brosubper = float ( n.brother.subparam [ 1 ]);
  let p00min = pminmax ( 0 , fzones , childx );// if child x get minX
  let p11max = pminmax ( 1 , fzones , childx ); 
 // float pline0 = rg ( map ( n.subper , 0 , 1 , p00min , p11max ));// rg
 // float pline1 = rg ( map ( n.subper , 0 , 1 , p00min , p11max ));// rg
  let pline0 , pline1 ;
  if ( child1 ) pline0 = map ( subper , 0 , 1 , p00min , p11max );// rg
  else pline0 = map ( brosubper , 0 , 1 , p00min , p11max );
  if ( child1 ) pline1 = map ( subper , 0 , 1 , p00min , p11max );// rg
  else pline1 = map ( brosubper , 0 , 1 , p00min , p11max );
  for ( let f = 0 ; f < fzones.length ; f ++ ) if ( zonewithinline ( fzones [ f ] , pline0 , pline1 , child1 , childx )) zo.push ( breakfzones ( fzones [ f ] , pline0 , pline1 , child1 , childx ));
 }
 if ( zo.length > 0 ) zo = sortzonesbyarea ( zo );
 for ( let i = 0 ; i < zo.length ; i ++) zo [  i ] .id [ 0 ]= n.nodei ;
 for ( let i = 0 ; i < zo.length ; i ++) zo [  i ] .id [ 1 ]= i ;
 return zo ;
}
function calcallzones (  no  ,  homedges ){
 for ( let n = 0 ; n < no.length ; n ++) no [  n ] .zones = calczones ( no [  n ], homedges );
 return no ;
}
function prophomedges (  homedge  ,  scaleprop ){
 let newhomedge = new Array();
 for ( let i = 0 ; i < homedge.length ; i ++) newhomedge.push ( new Zone ( createVector ( homedge [  i ] .pt [ 0 ] .x * scaleprop , homedge [  i ] .pt [ 0 ] .y ), createVector ( homedge [  i ] .pt [ 1 ] .x * scaleprop , homedge [  i ] .pt [ 1 ] .y )) );
 return newhomedge ;
}
function calctotpropfit (  no  ,  fitperprop ){ 
 let  totpropfit = 0 ;
 for ( let n = 0 ; n < no.length ; n ++) if ( no [  n ] .isleaf ) if ( no [  n ] .zones.length > 0 ) totpropfit += abs ( float ( no [  n ] .ideals [ 8 ])- float ( no [  n ] .reals [ 8 ]))* fitperprop ;
 return totpropfit ;
}
function calctotadjfit (  no  ,  fitpernonadj ){ 
 let  adjfit = 0 ;
 for ( let n = 0 ; n < no.length ; n ++) if ( no [  n ] .isleaf ){
  let idealsep = no [  n ] .ideals [ 9 ];
  let roominhome = false ;
  let isalreadyadj = false ;
  for ( let m = 0 ; m < no.length ; m ++) if ( txequal ( idealsep , no [  m ] .code )) roominhome = true ;
  if (! roominhome ) isalreadyadj = true ; 
  let  realsep = split ( no [  n ] .reals [ 9 ], ' ' );
  for ( let j = 0 ; j < realsep.length ; j ++) if ( txequal ( realsep [ j ], idealsep )|| txequal ( idealsep , "" )) isalreadyadj = true ;
  if (! isalreadyadj ) adjfit += fitpernonadj ;
 }
 return adjfit ;
}
function calcmissingzonesfit (  no  ,  fitpermis ){
 let  missfit = 0 ;
 for ( let n = 0 ; n < no.length ; n ++) if ( no [  n ] .isleaf ) if ( no [  n ] .zones.length == 0 ) missfit += fitpermis ;
 for ( let n = 0 ; n < no.length ; n ++) if ( no [  n ] .isleaf ) if ( no [  n ] .zones.length > 0 ) if ( no [  n ] .zones [  0 ] .area ()== 0 ) missfit += fitpermis ;
 return missfit ;
}
function calcclosetinbetween (  no  ,  fitpermis ){
 let  missfit = 0 ;
 for ( let n = 0 ; n < no.length ; n ++) if ( no [  n ] .isleaf ) if ( txequal ( no [  n ] .ideals [ 10 ], "2" )) if (! no [  n ] .brother.isleaf ) missfit += fitpermis ;
 return missfit ;
}
let dz ;
function setupdz (){
 dz = new Drawzones ();
}
function drawdz (){
 if ( dr.state ) dz.displaypoint ();
 if ( dr.state ) dz.display ();
}
function pressdz (){

  if (! dr.isover ()) if ( dr.state ) {
    dz.press ();
  }
 if ( dz.zns.length > 0 ){
  setuphoinedges ( dz.zns ); 
  recalctree ();
  recalchouse ();
  dr.turnoff()
  dz.zns = new Array();  
 }
}


class Drawzones {
 constructor (){
  this.zns ;
  this.p00 , this.p11 ;

  this.zns = new Array();
 }
  displaypoint (){
  push ();
  strokeWeight ( 2 * scand );
  stroke ( 50 );
  noFill ();

  let gridedmouse = scgr ( mouseshrink ( createVector ( mouseX , mouseY )) ); 
  if ( validarea ( this.zns )){
  ellipse ( gridedmouse.x , gridedmouse.y , 7 * scand , 7 * scand );

  line ( gridedmouse.x - 10 * scand , gridedmouse.y , gridedmouse.x + 10 * scand , gridedmouse.y );
  line ( gridedmouse.x , gridedmouse.y - 10 * scand , gridedmouse.x , gridedmouse.y + 10 * scand );
 }
  strokeWeight ( 2 * scand );
  stroke ( 150 );
  if ( this.p00 != null ) hiddenrec ( scgr ( this.p00 ) .x , scgr ( this.p00 ) .y , gridedmouse.x , gridedmouse.y );
  pop ();
 }
  display (){
  if ( this.zns != null ) for ( let i = 0 ; i < this.zns.length ; i ++) this.zns [  i ] .displaycreate ();
 }
  press (){
  if ( validarea ( this.zns )) if ( this.p00 == null && this.p11 == null ) this.p00 = mouseshrink ( createVector ( mouseX , mouseY ));
  else if ( this.p00 != null && this.p11 == null ){
  if ( validarea ( this.zns )){
   this.p11 = mouseshrink ( createVector ( mouseX , mouseY ));
   this.zns.push ( new Zone ( this.p00 , this.p11 ));
   this.p00 = null ;
   this.p11 = null ;
  //  alert("press the switch button")
 }
 }
 }
  emptyzones (){
  this.zns = new Array();
  this.p00 = null ;
  this.p11 = null ;
 }
}
function hiddenrec (  p00x  ,  p00y  ,  p11x  ,  p11y ){
 daline ( createVector ( p00x , p00y ), createVector ( p00x , p11y ), 10 * scand ); 
 daline ( createVector ( p00x , p11y ), createVector ( p11x , p11y ), 10 * scand ); 
 daline ( createVector ( p11x , p11y ), createVector ( p11x , p00y ), 10 * scand ); 
 daline ( createVector ( p11x , p00y ), createVector ( p00x , p00y ), 10 * scand );
}
function hashrectangle (  ax  ,  ay  ,  bx  ,  by ){
 rectMode ( CORNERS );
 // fill ( 255 , 0 , 0 );
 if ( bx > ax ) for ( let x = ax ; x < bx ; x += grunit ) if ( by > ay ) for ( let y = ay ; y < by ; y += grunit ){
 let beg = scgr ( createVector ( x , y ));
 let end = scgr ( createVector ( x + grunit , y + grunit ));
 let midmas = scgr ( createVector ( x + grunit * .5 , y + grunit * .5 )); 
 // rect ( beg.x , beg.y , end.x , end.y ); 
 daline ( beg , end , 5 * scand );
 daline ( createVector ( midmas.x , beg.y ), createVector ( end.x , midmas.y , 5 * scand ), 5 * scand );
  daline ( createVector ( beg.x , midmas.y ), createVector ( midmas.x , end.y , 5 * scand ), 5 * scand );
 }
 // hiddenrec ( ax , ay , bx , by );
 // for ( let i = 0 ; i < 1 ; i += .1 ) daline ( createVector ( ax , ay * i + by *( 1 - i )), createVector ( ax * i + bx *( 1 - i ), ay ), 5 * scand );
 // for ( let i = 0 ; i < 1 ; i += .1 ) daline ( createVector ( bx , ay * i + by *( 1 - i )), createVector ( ax * i + bx *( 1 - i ), by ), 5 * scand );
 // for ( let i = 0 ; i < 1 ; i += .1 ) line ( p00x * i + p11x *( 1 - i ), p00y *( 1 - i )+ p11y * i , p00x *( 1 - i )+ p11x * i , p00y * i + p11y *( 1 - i ));
}
function validarea (  czones ){
 let bout = true ;
 if (!( grpos.x < mouseX && mouseX < grpos.x + grsize.x && grpos.y < mouseY && mouseY < grpos.y + grsize.y )) bout = false ;
 for ( let i = 0 ; i < czones.length ; i ++){
  let p0 = scgr ( czones [  i ] .pt [ 0 ]);
  let p1 = scgr ( czones [  i ] .pt [ 1 ]);
  if ( p0.x < mouseX && p1.x > mouseX && p0.y < mouseY && p1.y > mouseY ) bout = false ;
 }
 return bout ;
}
class Border {
 constructor (   _id  ,   _pt ){
   this.id  = new Array ( 5 );// 0:nodei 1:zonei 2:sidei 3:borderi 4:tipo ( 0:normal , 1:entry 2:facade 3:introom   4:openning 5:door 6:window 7:wall 8: paramueble)
  this.pt  = new Array ( 2 );// 0:p0 1:p1 
  this.adj ;
  this.id = _id ;
  this.pt = _pt ;
 }
  cloneit (){// no clona adj
  let bout = new Border ( cloneintarr ( this.id ), clonevecarr ( this.pt ));
  return bout ;
 }
  pmid (){
  return createVector (( this.pt [ 0 ] .x + this.pt [ 1 ] .x )* .5 ,( this.pt [ 0 ] .y + this.pt [ 1 ] .y )* .5 );
 }
  bsiz (){
  return this.pt [ 1 ] .dist ( this.pt [ 0 ]);
 }
  display (){
  push ();
  drawwindow ( this.id [ 4 ], this.pt [ 0 ], this.pt [ 1 ]);
  drawdoor ( this.id [ 4 ], this.id [ 2 ], this.pt [ 0 ], this.pt [ 1 ]);
  drawwall ( this.id [ 4 ], this.adj , this.pt [ 0 ], this.pt [ 1 ]);
  drawopening ( this.id [ 4 ], this.adj , this.pt [ 0 ], this.pt [ 1 ]);
  drawsuportfurniture ( this.id [ 4 ], this.adj , this.pt [ 0 ], this.pt [ 1 ]);
  pop ();
 }
}
function caldadjborder (  bord  ,  nodes ){
 let bout = null ;
 for ( let n = 0 ; n < nodes.length ; n ++) if ( nodes [  n ] .isleaf ) for ( let z = 0 ; z < nodes [  n ] .zones.length ; z ++) for ( let b = 0 ; b < nodes [  n ] .zones [  z ] .borders.length ; b ++){
  let bord2 = nodes [  n ] .zones [  z ] .borders [  b ];
  if (!( bord.id [ 0 ]== bord2.id [ 0 ]&& bord.id [ 1 ]== bord2.id [ 1 ]&& bord.id [ 3 ]== bord2.id [ 3 ])){
  if ( vectorsequal ( bord.pt [ 0 ], bord2.pt [ 0 ])&& vectorsequal ( bord.pt [ 1 ], bord2.pt [ 1 ])) bout = nodes [  n ] .zones [  z ] .borders [  b ];
 }
 }
 return bout ;
}
function borderDEzones (  zone  ,  nodes ){
 let bout = new Array(); 
 let  ps  = new Array ( 4 );
 for ( let i = 0 ; i < ps.length ; i ++) ps [ i ] = new Array ( 2 ); 
 ps [ 0 ][ 0 ]= zone.pt [ 0 ] .copy ();
 ps [ 0 ][ 1 ]= zone.pt [ 2 ] .copy ();
 ps [ 1 ][ 0 ]= zone.pt [ 2 ] .copy ();
 ps [ 1 ][ 1 ]= zone.pt [ 1 ] .copy ();
 ps [ 2 ][ 0 ]= zone.pt [ 3 ] .copy ();
 ps [ 2 ][ 1 ]= zone.pt [ 1 ] .copy ();
 ps [ 3 ][ 0 ]= zone.pt [ 0 ] .copy ();
 ps [ 3 ][ 1 ]= zone.pt [ 3 ] .copy ();
 let  isonx =[ true , false , true , false ];
 for ( let s = 0 ; s < 4 ; s ++){
  let pointsinside = new Array(); 
  pointsinside.push ( ps [ s ][ 0 ]);
  for ( let n = 0 ; n < nodes.length ; n ++) if ( nodes [  n ] .isleaf ) for ( let z = 0 ; z < nodes [  n ] .zones.length ; z ++){
  let p00 = nodes [  n ] .zones [  z ] .pt [ 0 ] .copy ();
  let p01 = nodes [  n ] .zones [  z ] .pt [ 2 ] .copy ();
  let p10 = nodes [  n ] .zones [  z ] .pt [ 3 ] .copy ();
  let p11 = nodes [  n ] .zones [  z ] .pt [ 1 ] .copy ();
  if ( sameXY ( ps [ s ][ 0 ], p00 , isonx [ s ])&& withinXY ( ps [ s ][ 0 ], ps [ s ][ 1 ], p00 ,! isonx [ s ])) pointsinside.push ( nodes [  n ] .zones [  z ] .pt [ 0 ]); 
  if ( sameXY ( ps [ s ][ 0 ], p01 , isonx [ s ])&& withinXY ( ps [ s ][ 0 ], ps [ s ][ 1 ], p01 ,! isonx [ s ])) pointsinside.push ( nodes [  n ] .zones [  z ] .pt [ 2 ]); 
  if ( sameXY ( ps [ s ][ 0 ], p10 , isonx [ s ])&& withinXY ( ps [ s ][ 0 ], ps [ s ][ 1 ], p10 ,! isonx [ s ])) pointsinside.push ( nodes [  n ] .zones [  z ] .pt [ 3 ]); 
  if ( sameXY ( ps [ s ][ 0 ], p11 , isonx [ s ])&& withinXY ( ps [ s ][ 0 ], ps [ s ][ 1 ], p11 ,! isonx [ s ])) pointsinside.push ( nodes [  n ] .zones [  z ] .pt [ 1 ]);
 }
  pointsinside.push ( ps [ s ][ 1 ]);
  for ( let i = 0 ; i < pointsinside.length - 1 ; i ++) if (! vectorsequal ( pointsinside [  i ], pointsinside [  i + 1 ]) ){
  let ids  = new Array ( 5 );
  ids [ 0 ]= zone.id [ 0 ];
  ids [ 1 ]= zone.id [ 1 ];
  ids [ 2 ]= s ;
  let pts  = new Array ( 2 );
  pts [ 0 ]= pointsinside [  i ];
  pts [ 1 ]= pointsinside [  i + 1 ];
  bout.push ( new Border ( ids , pts ));
 }
 }
 for ( let b = 0 ; b < bout.length ; b ++) bout [  b ] .id [ 3 ]= b ;
 return bout ;
}
function drawopening (  tipo  ,  adj  ,  p0  ,  p1 ){
 if ( tipo == 4 ){
  strokeWeight ( 2 * scand );
  stroke ( 152 , 152 , 152 );
  line ( scgr ( p0 ) .x , scgr ( p0 ) .y , scgr ( p1 ) .x , scgr ( p1 ) .y );
 }
}
function drawsuportfurniture (  tipo  ,  adj  ,  p0  ,  p1 ){
 let drawwall = false ;
 if ( adj != null ) if ( tipo == 8 && adj.id [ 4 ]!= 4 && adj.id [ 4 ]!= 5 ) drawwall = true ;
 if ( adj == null ) if ( tipo == 8 ) drawwall = true ;
 if ( drawwall ){
  strokeWeight ( 4 * scand );
  stroke ( 30 , 30 , 30 );
  line ( scgr ( p0 ) .x , scgr ( p0 ) .y , scgr ( p1 ) .x , scgr ( p1 ) .y );
 // stroke ( 255 , 0 , 0 );
 // ellipse (( scgr ( p0 ) .x + scgr ( p1 ) .x )/ 2 ,( scgr ( p0 ) .y + scgr ( p1 ) .y )/ 2 , 5 , 5 );
 }
}
function drawwall (  tipo  ,  adj  ,  p0  ,  p1 ){// 0:normal  , 1:entry 2:facade 3:introom   4:openning 5:door 6:window 7:wall 8: paramueble 
 let drawwall = false ;
 if ( adj != null ) if ( tipo == 7 && adj.id [ 4 ]!= 4 && adj.id [ 4 ]!= 5 ) drawwall = true ;
 if ( adj == null ) if ( tipo == 7 ) drawwall = true ;
 if ( drawwall ){
  strokeWeight ( 4 * scand );
  stroke ( 30 , 30 , 30 );
  line ( scgr ( p0 ) .x , scgr ( p0 ) .y , scgr ( p1 ) .x , scgr ( p1 ) .y );
 }
}
function drawdoor (  tipo  ,  sidei  ,  p0  ,  p1 ){
 if ( tipo == 5 ){
  noFill ();
  stroke ( 30 , 30 , 30 );
  strokeWeight ( 1 * scand );
  if ( sidei == 0 ) arc ( scgr ( p0 ) .x , scgr ( p0 ) .y , scsif ( .90 * 2 ), scsif ( .90 * 2 ), 0 , PI * .5 );
  if ( sidei == 1 ) arc ( scgr ( p0 ) .x , scgr ( p1 ) .y , scsif ( .90 * 2 ), scsif ( .90 * 2 ), PI * 1.5 , PI * 2 );
  if ( sidei == 2 ) arc ( scgr ( p1 ) .x , scgr ( p1 ) .y , scsif ( .90 * 2 ), scsif ( .90 * 2 ), PI , PI * 1.5 );
  if ( sidei == 3 ) arc ( scgr ( p1 ) .x , scgr ( p0 ) .y , scsif ( .90 * 2 ), scsif ( .90 * 2 ), PI * .5 , PI );
  if ( sidei == 0 ) line ( scgr ( p0 ) .x , scgr ( p0 ) .y , scgr ( p0 ) .x + scsif ( .90 ), scgr ( p0 ) .y );
  if ( sidei == 1 ) line ( scgr ( p0 ) .x , scgr ( p1 ) .y , scgr ( p0 ) .x , scgr ( p1 ) .y - scsif ( .90 ));
  if ( sidei == 2 ) line ( scgr ( p1 ) .x , scgr ( p1 ) .y , scgr ( p1 ) .x - scsif ( .90 ), scgr ( p1 ) .y );
  if ( sidei == 3 ) line ( scgr ( p1 ) .x , scgr ( p0 ) .y , scgr ( p1 ) .x , scgr ( p0 ) .y + scsif ( .90 ));
  strokeWeight ( 2 * scand );
  if ( sidei == 0 ) line ( scgr ( p0 ) .x - 5 * scand , scgr ( p0 ) .y , scgr ( p0 ) .x + 5 * scand , scgr ( p0 ) .y );      // marcos
  if ( sidei == 0 ) line ( scgr ( p0 ) .x - 5 * scand , scgr ( p0 ) .y + scsif ( .90 ), scgr ( p0 ) .x + 5 * scand , scgr ( p0 ) .y + scsif ( .90 ));
  if ( sidei == 1 ) line ( scgr ( p0 ) .x , scgr ( p1 ) .y - 5 * scand , scgr ( p0 ) .x , scgr ( p1 ) .y + 5 * scand );
  if ( sidei == 1 ) line ( scgr ( p0 ) .x + scsif ( .90 ), scgr ( p1 ) .y - 5 * scand , scgr ( p0 ) .x + scsif ( .90 ), scgr ( p1 ) .y + 5 * scand );
  if ( sidei == 2 ) line ( scgr ( p1 ) .x - 5 * scand , scgr ( p1 ) .y , scgr ( p1 ) .x + 5 * scand , scgr ( p1 ) .y );
  if ( sidei == 2 ) line ( scgr ( p1 ) .x - 5 * scand , scgr ( p1 ) .y - scsif ( .90 ), scgr ( p1 ) .x + 5 * scand , scgr ( p1 ) .y - scsif ( .90 ));
  if ( sidei == 3 ) line ( scgr ( p1 ) .x , scgr ( p0 ) .y - 5 * scand , scgr ( p1 ) .x , scgr ( p0 ) .y + 5 * scand );
  if ( sidei == 3 ) line ( scgr ( p1 ) .x - scsif ( .90 ), scgr ( p0 ) .y - 5 * scand , scgr ( p1 ) .x - scsif ( .90 ), scgr ( p0 ) .y + 5 * scand );
  strokeWeight ( 4 * scand );
  if ( sidei == 0 ) line ( scgr ( p0 ) .x , scgr ( p0 ) .y + scsif ( .9 ), scgr ( p1 ) .x , scgr ( p1 ) .y );        // pared
  if ( sidei == 1 ) line ( scgr ( p0 ) .x + scsif ( .9 ), scgr ( p1 ) .y , scgr ( p1 ) .x , scgr ( p1 ) .y );
  if ( sidei == 2 ) line ( scgr ( p1 ) .x , scgr ( p1 ) .y - scsif ( .9 ), scgr ( p1 ) .x , scgr ( p0 ) .y );
  if ( sidei == 3 ) line ( scgr ( p1 ) .x - scsif ( .9 ), scgr ( p0 ) .y , scgr ( p0 ) .x , scgr ( p0 ) .y );
 }
}
function drawwindow (  tipo  ,  p0  ,  p1 ){
 if ( tipo == 6 ){
  push ();
  strokeWeight ( 2 * scand );
  stroke ( 152 , 180 , 222 );
  line ( scgr ( p0 ) .x , scgr ( p0 ) .y , scgr ( p1 ) .x , scgr ( p1 ) .y );
  stroke ( 30 , 30 , 30 );
  if ( p0.x == p1.x ){
  line ( scgr ( p0 ) .x - 5 * scand , scgr ( p0 ) .y , scgr ( p0 ) .x + 5 * scand , scgr ( p0 ) .y );
  line ( scgr ( p1 ) .x - 5 * scand , scgr ( p1 ) .y , scgr ( p1 ) .x + 5 * scand , scgr ( p1 ) .y );
 } else {
  line ( scgr ( p0 ) .x , scgr ( p0 ) .y - 5 * scand , scgr ( p0 ) .x , scgr ( p0 ) .y + 5 * scand );
  line ( scgr ( p1 ) .x , scgr ( p1 ) .y - 5 * scand , scgr ( p1 ) .x , scgr ( p1 ) .y + 5 * scand );
 }
  pop ();
 }
}
class Mueble {
 constructor (  _tipo  ,  _rot  ,  _pos  ,  _pos2 ){
  this.tipo ;
  this.rot ;
  this.pos , this.pos2 ;
  this.tipo = _tipo ;
  this.rot = _rot ;
  this.pos = _pos ;
  this.pos2 = _pos2 ;
 }
  cloneit (){
  let cout = new Mueble ( this.tipo , this.rot , this.pos , this.pos2 );
  return cout ;
 }
  display (){
  push ();
  if ( this.pos != null && this.pos2 != null ) drawmueble ( this.tipo , this.rot , this.pos , this.pos2 );
  pop ();
 }
}
function calcmuebleslist (  node ){
 let mout = new Array();
 if ( txequal ( roomnonumber ( node.code ), "Cl" )) mout.push ( new Mueble ( 7 , 0 , node.zones [  0 ] .pt [ 0 ], node.zones [  0 ] .pt [ 1 ]));
 if ( txequal ( roomnonumber ( node.code ), "Be" )) for ( let z = 0 ; z < node.zones.length ; z ++) for ( let b = 0 ; b < node.zones [  z ] .borders.length ; b ++) if ( node.zones [  z ] .borders [  b ] .id [ 4 ]== 8 ) if ( node.zones [  z ] .zwidth ()> 2 && node.zones [  z ] .zlength ()> 2 ){
  if ( node.zones [  z ] .borders [  b ] .adj != null ) mout.push ( new Mueble ( 10 ,-( node.zones [  z ] .borders [  b ] .id [ 2 ]+ 1 ), node.zones [  z ] .borders [  b ] .pmid () .copy (), node.zones [  0 ] .pt [ 1 ]));
  else mout.push ( new Mueble ( 0 ,-( node.zones [  z ] .borders [  b ] .id [ 2 ]+ 1 ), node.zones [  z ] .borders [  b ] .pmid () .copy (), node.zones [  0 ] .pt [ 1 ]));
 }

 if ( txequal ( roomnonumber ( node.code ), "Ba" )){
  let entsi = false ;
  for ( let z = 0 ; z < node.zones.length ; z ++) for ( let b = 0 ; b < node.zones [  z ] .borders.length ; b ++) if ( node.zones [  z ] .borders [  b ] .id [ 4 ]== 5 ) if ( node.zones [  z ] .borders [  b ] .id [ 2 ]== 0 || node.zones [  z ] .borders [  b ] .id [ 2 ]== 1 ) entsi = true ; 
  let  ap =[[ .25 , .75 ],[ .75 , .25 ]];
  for ( let z = 0 ; z < node.zones.length ; z ++) for ( let b = 0 ; b < node.zones [  z ] .borders.length ; b ++) if ( node.zones [  z ] .borders [  b ] .id [ 4 ]== 8 ){
  let lavpos = createVector ( node.zones [  z ] .borders [  b ] .pt [ 0 ] .x * ap [ int ( entsi )][ 0 ]+ node.zones [  z ] .borders [  b ] .pt [ 1 ] .x * ap [ int (! entsi )][ 0 ], node.zones [  z ] .borders [  b ] .pt [ 0 ] .y * ap [ int ( entsi )][ 0 ]+ node.zones [  z ] .borders [  b ] .pt [ 1 ] .y * ap [ int (! entsi )][ 0 ]);
  let wcpos = createVector ( node.zones [  z ] .borders [  b ] .pt [ 0 ] .x * .5 + node.zones [  z ] .borders [  b ] .pt [ 1 ] .x * .5 , node.zones [  z ] .borders [  b ] .pt [ 0 ] .y * .5 + node.zones [  z ] .borders [  b ] .pt [ 1 ] .y * .5 );
  let duchpos = createVector ( node.zones [  z ] .borders [  b ] .pt [ 0 ] .x * ap [ int ( entsi )][ 1 ]+ node.zones [  z ] .borders [  b ] .pt [ 1 ] .x * ap [ int (! entsi )][ 1 ], node.zones [  z ] .borders [  b ] .pt [ 0 ] .y * ap [ int ( entsi )][ 1 ]+ node.zones [  z ] .borders [  b ] .pt [ 1 ] .y * ap [ int (! entsi )][ 1 ]);
  mout.push ( new Mueble ( 1 ,-( node.zones [  z ] .borders [  b ] .id [ 2 ]+ 1 ), lavpos , node.zones [  0 ] .pt [ 1 ]));
  mout.push ( new Mueble ( 3 ,-( node.zones [  z ] .borders [  b ] .id [ 2 ]+ 1 ), wcpos , node.zones [  0 ] .pt [ 1 ]));
  mout.push ( new Mueble ( 5 ,-( node.zones [  z ] .borders [  b ] .id [ 2 ]+ 1 ), duchpos , node.zones [  0 ] .pt [ 1 ]));
 }
 }
 if ( txequal ( roomnonumber ( node.code ), "Li" )){
  let mesapos = createVector ( 0 , 0 );
  let livinpos = createVector ( 0 , 0 );
  let mesa2pos = createVector ( 0 , 0 );
  let zodraw = node.zones [  0 ];
  if ( zodraw.lengthisx ()){
  mesapos = createVector ( wavgflot ( zodraw.pt [ 0 ] .x , zodraw.pt [ 1 ] .x , .25 ), zodraw.pmid () .y );
  livinpos = createVector ( wavgflot ( zodraw.pt [ 0 ] .x , zodraw.pt [ 1 ] .x , .75 ), zodraw.pmid () .y - zodraw.ydim ()* .15 );
  mesa2pos = createVector ( wavgflot ( zodraw.pt [ 0 ] .x , zodraw.pt [ 1 ] .x , .75 ), zodraw.pmid () .y + zodraw.ydim ()* .15 );
 } else {
  mesapos = createVector ( zodraw.pmid () .x , wavgflot ( zodraw.pt [ 0 ] .y , zodraw.pt [ 1 ] .y , .25 ));
  livinpos = createVector ( zodraw.pmid () .x - zodraw.xdim ()* .15 , wavgflot ( zodraw.pt [ 0 ] .y , zodraw.pt [ 1 ] .y , .75 ));
  mesa2pos = createVector ( zodraw.pmid () .x + zodraw.xdim ()* .15 , wavgflot ( zodraw.pt [ 0 ] .y , zodraw.pt [ 1 ] .y , .75 ));
 }     
  mout.push ( new Mueble ( 6 , 0 , mesapos , node.zones [  0 ] .pt [ 1 ]));
  mout.push ( new Mueble ( 2 , int (! zodraw.lengthisx ())* 3 , livinpos , node.zones [  0 ] .pt [ 1 ]));
  mout.push ( new Mueble ( 4 , int (! zodraw.lengthisx ()), mesa2pos , node.zones [  0 ] .pt [ 1 ]));
 }
 if ( txequal ( roomnonumber ( node.code ), "Ki" )){
  let livinpos = createVector ( 0 , 0 );
  let mesa2pos = createVector ( 0 , 0 );
  let zodraw = node.zones [  0 ];
  if ( zodraw.lengthisx ()){
  livinpos = createVector ( wavgflot ( zodraw.pt [ 0 ] .x , zodraw.pt [ 1 ] .x , .25 ), zodraw.pmid () .y );
  mesa2pos = createVector ( wavgflot ( zodraw.pt [ 0 ] .x , zodraw.pt [ 1 ] .x , .75 ), zodraw.pmid () .y );
 } else {
  livinpos = createVector ( zodraw.pmid () .x , wavgflot ( zodraw.pt [ 0 ] .y , zodraw.pt [ 1 ] .y , .25 ));
   mesa2pos = createVector ( zodraw.pmid () .x , wavgflot ( zodraw.pt [ 0 ] .y , zodraw.pt [ 1 ] .y , .75 ));
 }     
  mout.push ( new Mueble ( 9 , int (! zodraw.lengthisx ()), livinpos , node.zones [  0 ] .pt [ 1 ]));
  mout.push ( new Mueble ( 91 , int (! zodraw.lengthisx ()), mesa2pos , node.zones [  0 ] .pt [ 1 ]));
 }
 return mout ;
}
function drawmueble (  tipo  ,  rot  ,  pos  ,  pos2 ){
 let scpos = scgr ( pos );
 let scpos2 = scgr ( pos2 );
 let scgrid = scsif ( grunit );
 rectMode ( CORNER );
 push ();
 translate ( scpos.x , scpos.y );
 rotate ( HALF_PI * rot );
 translate (- scpos.x ,- scpos.y );
 strokeWeight ( 1 * scand );
 if ( tipo % 2 == 0 ) stroke ( 180 );
 if ( tipo % 2 == 1 ) stroke ( 200 );
 noFill ();
 if ( tipo == 0 ){// BED WITH BARGUENOS
  let bed = createVector ( 1.6 * grscale , 2 * grscale );
  let sheet = createVector ( 1.6 * grscale , .6 * grscale );
  let sheet2 = createVector ( 1.6 * grscale , .9 * grscale );
  let pillow = createVector ( .4 * grscale , .2 * grscale );
  let buro = createVector ( .4 * grscale , .4 * grscale );
  rect ( scpos.x - bed.x * .5 , scpos.y , bed.x , bed.y );
  rect ( scpos.x - bed.x * .5 , scpos.y , sheet.x , sheet.y );
  rect ( scpos.x - bed.x * .5 , scpos.y , sheet2.x , sheet2.y );
  rect ( scpos.x +( .2 * grscale )- bed.x * .5 , scpos.y +( .2 * grscale ), pillow.x , pillow.y );
  rect ( scpos.x +( 1 * grscale )- bed.x * .5 , scpos.y +( .2 * grscale ), pillow.x , pillow.y );
  rect ( scpos.x -( .6 * grscale )- bed.x * .5 , scpos.y +( .2 * grscale ), buro.x , buro.y );
  rect ( scpos.x + bed.x +( .2 * grscale )- bed.x * .5 , scpos.y +( .2 * grscale ), buro.x , buro.y );
 }

 if ( tipo == 1 ){// LAVABO
  let lavabo = createVector ( .8 * grscale , .4 * grscale );
  let circ = createVector ( .4 * grscale , .3 * grscale );
  rect ( scpos.x - lavabo.x * .5 , scpos.y , lavabo.x , lavabo.y );
  ellipse ( scpos.x , scpos.y + lavabo.y * .5 , circ.x , circ.y );
  line ( scpos.x , scpos.y , scpos.x , scpos.y + lavabo.y * .5 );
 }

 if ( tipo == 2 ){// SOFA 3 CAMBIAR A 2
 let mueble = createVector ( 2.2 * grscale , .8 * grscale );
 let cojin = createVector ( .6 * grscale , .6 * grscale ); 
 rect ( scpos.x - mueble.x * .5 , scpos.y - mueble.y * .5 , mueble.x , mueble.y , mueble.y * .2 );
 rect ( scpos.x + grscale * .2 - mueble.x * .5 , scpos.y + grscale * .2 - mueble.y * .5 , cojin.x , cojin.y , mueble.y * .2 );
 rect ( scpos.x + grscale * .8 - mueble.x * .5 , scpos.y + grscale * .2 - mueble.y * .5 , cojin.x , cojin.y , mueble.y * .2 );
 rect ( scpos.x + grscale * 1.4 - mueble.x * .5 , scpos.y + grscale * .2 - mueble.y * .5 , cojin.x , cojin.y , mueble.y * .2 );
 line ( scpos.x + grscale * .2 - mueble.x * .5 , scpos.y + grscale * .2 - mueble.y * .5 , scpos.x + mueble.x * .5 - grscale * .2 , scpos.y + grscale * .2 - mueble.y * .5 );
 }
 if ( tipo == 3 ){// WC
  let tapa = createVector ( .5 * grscale , .25 * grscale );
  let retrete = createVector ( .3 * grscale , .45 * grscale );
  rect ( scpos.x - tapa.x * .5 , scpos.y , tapa.x , tapa.y , tapa.y * .2 );
  rect ( scpos.x + grscale * .1 - tapa.x * .5 , scpos.y + tapa.y + grscale * .05 , retrete.x , retrete.y , tapa.y * .2 );
 }
 if ( tipo == 4 ){// mesa
  let mesa = createVector ( 1.2 * grscale , .4 * grscale );
  rect ( scpos.x - mesa.x * .5 , scpos.y - mesa.y * .5 , mesa.x , mesa.y , mesa.y * .2 );
 }
 if ( tipo == 5 ){// DUCHA
  let ducha = createVector ( .8 * grscale , .8 * grscale );
  rect ( scpos.x - ducha.x * .5 , scpos.y , ducha.x , ducha.y );
  ellipse ( scpos.x , scpos.y + ducha.y * .3 , .1 * grscale , .1 * grscale );
 }
 if ( tipo == 6 ){// MESA COMedor 3personas
  let mesa = createVector ( .7 * grscale , .7 * grscale );
  let asientos = createVector ( 1.1 * grscale , 1.1 * grscale );
  ellipse ( scpos.x , scpos.y , mesa.x , mesa.y );
  arc ( scpos.x , scpos.y , asientos.x , asientos.y , PI , PI + QUARTER_PI );
  arc ( scpos.x , scpos.y , asientos.x , asientos.y ,- .4 * PI ,- .4 * PI + QUARTER_PI );
  arc ( scpos.x , scpos.y , asientos.x , asientos.y , .3 * PI , .3 * PI + QUARTER_PI );
 }
 if ( tipo == 7 ){// CLOSET MODULOS // scgrid
  for ( let x = scpos.x ; x < scpos2.x ; x += scgrid ) for ( let y = scpos.y ; y < scpos2.y ; y += scgrid ){
  if ( x + scgrid <= scpos2.x && y + scgrid <= scpos2.y ){
   rect ( x , y , scgrid , scgrid );
   line ( x , y , x + scgrid , y + scgrid );
   line ( x + scgrid , y , x , y + scgrid );
 } else if ( x + scgrid > scpos2.x && y + scgrid <= scpos2.y ){
   rect ( x , y , scpos2.x - x , scgrid );
   line ( x , y , scpos2.x , y + scgrid );
   line ( scpos2.x , y , x , y + scgrid );
 } else {
   rect ( x , y , scgrid , scpos2.y - y );
   line ( x , y , x + scgrid , scpos2.y );
   line ( x + scgrid , y , x , scpos2.y );
 }
 }
 }

 if ( tipo == 8 ){// BEDROOM 1 CAMA
  let bed = createVector ( 1.2 * grscale , 2 * grscale );
  let sheet = createVector ( 1.2 * grscale , .6 * grscale );
  let sheet2 = createVector ( 1.2 * grscale , .9 * grscale );
  let pillow = createVector ( .8 * grscale , .2 * grscale );
  let buro = createVector ( .4 * grscale , .4 * grscale );
  rect ( scpos.x - bed.x * .5 , scpos.y , bed.x , bed.y );
  rect ( scpos.x - bed.x * .5 , scpos.y , sheet.x , sheet.y );
  rect ( scpos.x - bed.x * .5 , scpos.y , sheet2.x , sheet2.y );
  rect ( scpos.x +( .2 * grscale )- bed.x * .5 , scpos.y +( .2 * grscale ), pillow.x , pillow.y );
  rect ( scpos.x -( .6 * grscale )- bed.x * .5 , scpos.y +( .2 * grscale ), buro.x , buro.y );
 }

 if ( tipo == 9 ){// COCINA MUEBLE
  let tarja = createVector ( .6 * grscale , .4 * grscale );
  rect ( scpos.x - tarja.x * .5 , scpos.y - tarja.y * .5 , tarja.x , tarja.y );
  line ( scpos.x , scpos.y - tarja.y * .5 , scpos.x , scpos.y - tarja.y * .5 + .2 * grscale );
 }

 if ( tipo == 91 ){// COCINA TARJA
  let tarja = createVector ( .6 * grscale , .4 * grscale );
  rect ( scpos.x - tarja.x * .5 , scpos.y - tarja.y * .5 , tarja.x , tarja.y );
  line ( scpos.x , scpos.y - tarja.y * .5 , scpos.x , scpos.y + tarja.y * .5 );
  line ( scpos.x - tarja.x * .5 , scpos.y , scpos.x + tarja.x * .5 , scpos.y );
 }


 if ( tipo == 10 ){// MASTER BEDROOM NO SIDETABLE
  let bed = createVector ( 1.6 * grscale , 2 * grscale );
  let sheet = createVector ( 1.6 * grscale , .6 * grscale );
  let sheet2 = createVector ( 1.6 * grscale , .9 * grscale );
  let pillow = createVector ( .4 * grscale , .2 * grscale );

  rect ( scpos.x - bed.x * .5 , scpos.y , bed.x , bed.y );
  rect ( scpos.x - bed.x * .5 , scpos.y , sheet.x , sheet.y );
  rect ( scpos.x - bed.x * .5 , scpos.y , sheet2.x , sheet2.y );
  rect ( scpos.x +( .2 * grscale )- bed.x * .5 , scpos.y +( .2 * grscale ), pillow.x , pillow.y );
  rect ( scpos.x +( 1 * grscale )- bed.x * .5 , scpos.y +( .2 * grscale ), pillow.x , pillow.y );
 }
 pop ();
}
let evolve ;
function fitnessat (  ho  ,   att ){
 let f = 0 ;
 let temph = ho.clonenewgenes ( att );
 f -= temph.totfit ;
 return f ;
}
class Atribute {
 constructor (  _name  ,  _min  ,  _max ){
  this.name ;
  this.minV ;
  this.maxV ;
  this.name = _name ;
  this.minV = _min ;
  this.maxV = _max ;
 }
  clone (){
  let clon = new Atribute ( this.name , this.minV , this.maxV );
  return clon ;
 }
}
class Population {
 constructor (  ho  ,  _nPop  ,   _at ){
   this.pop ;
  this.nPop ;
   this.at ;
  this.nPop = _nPop ;
  this.at = _at ;
  this.pop  = new Array ( this.nPop );
  for ( let i = 0 ; i < this.nPop ; i ++) this.pop [ i ]= new Individual ( this.at ); 
  for ( let i = 0 ; i < this.nPop ; i ++) this.pop [ i ] .evaluate ( ho );
  this.pop = this.orderInds ( this.pop );                       // Arrays is a JAVA class identifier // sort is one of its functions: it sorts a class of comparable elements
 }
  select (){
  let whichind = int ( floor (( this.nPop - .000001 )*( 1.0 - sq ( random ( 0 , 1 )) )) );       // skew distribution ; multiplying by 99.999999 scales a number from 0 - 1 to 0 - 99 , BUT NOT 100
 // let whichind = int ( floor (( float ( this.nPop - 1e - 6 ))*( 1.0 - sq ( random ( 0 , 1 )) )) );
  if ( whichind == this.nPop ) whichind = 0 ;
  return this.pop [ whichind ];                       // the sqrt of a number between 0 - 1 has bigger possibilities of giving us a smaller number
 }                             // if we subtract that squares number from 1 the opposite is true -> we have bigger possibilities of having a larger number
  sex (  a  ,  b ){
  let c = new Individual ( this.at );
  for ( let i = 0 ; i < c.genes.length ; i ++){
  if ( random ( 0 , 1 )< 0.5 ) c.genes [ i ]= a.genes [ i ];
  else c.genes [ i ]= b.genes [ i ];
 }
  c.mutate ();
  c.inPhens ();
  return c ;
 }
  evolve (  ho ){
  let a = this.select ();
  let b = this.select ();                    // breed the two selected individuals  
  let x = this.sex ( a , b );                    // place the offspring in the lowest position in the population , thus replacing the previously weakest offspring  
  this.pop [ 0 ]= x ;                         // evaluate the new individual ( grow ) 
  x.evaluate ( ho );                        // the fitter offspring will find its way in the population ranks  
  this.pop = this.orderInds ( this.pop );
 }
   orderInds (   inarr ){
  let tmp = inarr [ 0 ] .clone ();
  for ( let i = 0 ; i < inarr.length ; i ++) for ( let j = i + 1 ; j < inarr.length ; j ++) if ( inarr [ i ] .iFit > inarr [ j ] .iFit ){
  tmp = inarr [ i ];
  inarr [ i ]= inarr [ j ];
  inarr [ j ]= tmp ;
 }
  return inarr ;
 }
}
class Individual { 
 constructor (   _a ){
  this.iFit ;
   this.genes ;
   this.phenos , this.phenosmin , this.phenosmax ;
   this.a ;
  this.a = _a ;
  this.iFit = 0 ;
  this.genes  = new Array ( this.a.length );
  this.phenos  = new Array ( this.genes.length );
  this.phenosmin  = new Array ( this.phenos.length );
  this.phenosmax  = new Array ( this.phenos.length );
  for ( let i = 0 ; i < this.phenosmin.length ; i ++) this.phenosmin [ i ]= this.a [ i ] .minV ;
  for ( let i = 0 ; i < this.phenosmax.length ; i ++) this.phenosmax [ i ]= this.a [ i ] .maxV ; 
  for ( let i = 0 ; i < this.genes.length ; i ++) this.genes [ i ]= int ( random ( 256 ));
  for ( let i = 0 ; i < this.phenos.length ; i ++) this.phenos [ i ]= map ( this.genes [ i ], 0 , 256 , this.phenosmin [ i ], this.phenosmax [ i ]);
 }
  inGens (){ 
  this.genes  = new Array ( this.a.length );
  for ( let i = 0 ; i < this.genes.length ; i ++) this.genes [ i ]= int ( random ( 256 ));
 }
  inPhens (){
  for ( let i = 0 ; i < this.phenos.length ; i ++) this.phenos [ i ]= map ( this.genes [ i ], 0 , 256 , this.phenosmin [ i ], this.phenosmax [ i ]);
 }
  mutate (){                         // 5 % mutation rate
  for ( let i = 0 ; i < this.genes.length ; i ++) if ( random ( 100 )< 5 ) this.genes [ i ]= int ( random ( 256 ));
 }
  evaluate (  ho ){
  this.iFit = fitnessat ( ho , this.phenos );
 }
  clone (){
  let as  = new Array ( this.a.length );
  for ( let i = 0 ; i < this.a.length ; i ++) as [ i ]= this.a [ i ] .clone ();
  let clon = new Individual ( as );
  return clon ;
 }
}
let inandroid = false ;
let keybisopen = false ;
let scand = 1 ;
let  roomsIN =[ "Li" , "Be" , "Ba" , "Ki" ];
let  lockIN =[ 0 , 0 ];
let  roomDATAIN =[[ "Be" , "Bedroom" , "14.4" , "8.8" , "24.0" , "4.0" , "3.2" , "4.8" , "1.00" , "Li" , "1" ],[ "Ba" , "Bathroom" , "4.8" , "3.2" , "8.0" , "2.4" , "1.6" , "3.2" , "0.98" , "Be" , "1" ],[ "Cl" , "Closet" , "3.2" , "0.8" , "12.8" , "0.8" , "0.8" , "0.8" , "0.50" , "Be" , "2" ],[ "Di" , "Dining" , "12.0" , "8.8" , "24.0" , "4.0" , "3.2" , "4.8" , "0.83" , "Li" , "0" ],[ "Ki" , "Kitchen" , "3.2" , "0.8" , "12.8" , "0.8" , "0.8" , "0.8" , "0.25" , "Li" , "2" ],[ "La" , "Laundry" , "4.0" , "3.2" , "4.8" , "2.4" , "1.6" , "3.2" , "0.33" , "Li" , "1" ],[ "Li" , "Living" , "20.0" , "16.0" , "24.0" , "4.8" , "3.2" , "6.4" , "0.50" , "" , "0" ],[ "Ha" , "Hall" , "2.4" , "1.6" , "12.8" , "1.6" , "1.6" , "1.6" , "0.50" , "Li" , "2" ]];
let  rooms = getroomNAMES ( roomsIN );
let  roomDATA = getroomDATA ( rooms , roomDATAIN );
let  lockgenes = getroomLOCKS ( rooms , lockIN );
function setup (){
 createCanvas ( 900 , 600 );
 setupgr ();
 setupho ();
 setuptr ();
 setupid ();
 setupdraw ();
 setupsl ( rooms , roomDATA );
 changeroomDATA ();
 setupga ();
 setupdz ();
 //createfile ( "data / ui.pde" , "a_Compile_Libs.pde" );
}


function draw (){
 background ( 255 );
 drawgr ();
 drawho ();
 drawsl ();
 if ( evolve ){
  for ( let i = 0 ; i < 10 ; i ++){
  ho.evolvehoga (); 
  ho.ng = ho.clonengs ( 5 );// pasar genes de clone a ho.ng
  ho.setuptr ( lockgenes );
  ho.setupid ();
  ho.setupdraw ();
 }
 }
 drawdz ();
}
function mousePressed (){
  pressdz ();
 presssl ();
 pressadddrooms ();
 pressho ();

}
function mouseReleased (){
 releasesl ();
}
function keyPressed (){
 typeho ();
}
//import java.util.Date ;
//function createfile (  filename  ,  filetoexclude ){
// saveStrings ( filename , joinfilestrings ( listFileNames ( filetoexclude , sketchPath ()) ));
// print ( "file created in data" );
//}
//function  joinfilestrings (  filenames ){
// let alltext = new Array();
// for ( let n:filenames ){
//  let  lines = loadStrings ( n );
// // for ( let s:lines ) alltext.push ( s + "\n" );
//  for ( let s:lines ) alltext.push ( s );
// }
// let alltextst  = new Array ( alltext.length );
// for ( let i = 0 ; i < alltext.length ; i ++) alltextst [ i ]= alltext [  i ]; 
// return alltextst ;
//}
//function listFileNames (  filename  ,  dir ){
// File file = new File ( dir );
// if ( file.isDirectory ()){
//  let allnames = file.list ();
//  let names = new Array();
//  for ( let i = 0 ; i < allnames.length ; i ++) if (! txequal123 ( allnames [ i ], filename )&&( txequal123 ( allnames [ i ] .substring ( allnames [ i ] .length- 3 , allnames [ i ] .length), "pde" )) ) names.push ( allnames [ i ]);
//  return names ;
// } else return null ;
//}
//function txequal123 (  a  ,  b ){
// if ( a == null || b == null ) return false ;
// else {
//  let al = a.length;
//  let bl = b.length;
//  let minl ;
//  let bout = true ;
//  if ( al != bl ) bout = false ;
//  if ( al < bl ) minl = al ;
//  else minl = bl ;
//  for ( let i = 0 ; i < minl ; i ++) if ( a.charAt ( i )!= b.charAt ( i )) bout = false ; 
//  return bout ;
// }
//}
function clonezonelist (  zlistin ){
 let zlistout = new Array();
 for ( let i = 0 ; i < zlistin.length ; i ++) zlistout.push ( zlistin [  i ] .cloneit ());
 return zlistout ;
}
function  clonengarrwithgenes (   ngin  ,   genes ){
 let  nout  = new Array ( ngin.length );
 for ( let i = 0 ; i < ngin.length ; i ++) nout [ i ]= ngin [ i ] .cloneactgene ( genes [ i ]);
 return nout ;
}
//                                 BOOLEAN
//                                    ischilda
function ifischilda (  loc ){            
 let bout = false ;
 if ( loc.charAt ( loc.length- 1 )== '0' || int ( loc.charAt ( loc.length- 1 ))== int ( "0 " )) bout = true ;
 return bout ;
}
function ischildx (  g0 ){                          // childx
 let bout ; 
 if ( g0 < .5 ) bout = true ;
 else bout = false ;
 return bout ;
}
function zonewithinline (  fzone  ,  pline0  ,  pline1  ,  child1  ,  childx ){  // zonewithinline
 if  ( child1 && childx && fzone.pt [ 0 ] .x < pline0 ) return true ;
 else if ( child1 &&! childx && fzone.pt [ 0 ] .y < pline0 ) return true ;
 else if (! child1 && childx && fzone.pt [ 1 ] .x > pline1 ) return true ;
 else if (! child1 &&! childx && fzone.pt [ 1 ] .y > pline1 ) return true ;
 else return false ;
}
//                                  FLOATS
function pminmax (  min0max1  ,  fzones  ,  childx ){           // min max from zones
 let fout ;
 if ( fzones.length == 0 ){
  fout = 0 ;
 } else if ( min0max1 == 0 ){
  if ( childx ){
  fout = fzones [  0 ] .pt [ 0 ] .x ;
  for ( let f = 0 ; f < fzones.length ; f ++ ) if ( fzones [ f ] .pt [ 0 ] .x < fout ) fout = fzones [ f ] .pt [ 0 ] .x ;
 } else {
  fout = fzones [  0 ] .pt [ 0 ] .y ;
  for ( let f = 0 ; f < fzones.length ; f ++ ) if ( fzones [ f ] .pt [ 0 ] .y < fout ) fout = fzones [ f ] .pt [ 0 ] .y ;
 }
 } else {
  if ( childx ){
  fout = fzones [  0 ] .pt [ 1 ] .x ;
  for ( let f = 0 ; f < fzones.length ; f ++ ) if ( fzones [ f ] .pt [ 1 ] .x > fout ) fout = fzones [ f ] .pt [ 1 ] .x ;
 } else {
  fout = fzones [  0 ] .pt [ 1 ] .y ;
  for ( let f = 0 ; f < fzones.length ; f ++ ) if ( fzones [ f ] .pt [ 1 ] .y > fout ) fout = fzones [ f ] .pt [ 1 ] .y ;
 }
 }
 return fout ;
}
//                                 PVECTOR
//                                    treepos
function locpos (  loc  ,  treepos  ,  treesize ){
 let pv ;
 let pvx = treepos.x ;
 for ( let i = 1 ; i < loc.length; i ++){
  if ( loc.charAt ( i )== '0' || int ( loc.charAt ( i ))== int ( "0 " )){
  pvx = pvx - treesize.x / pow ( 2 , i );
 }
 }
 for ( let i = 1 ; i < loc.length; i ++){
  if ( loc.charAt ( i )== '1' || int ( loc.charAt ( i ))== int ( "1 " )){
  pvx = pvx + treesize.x / pow ( 2 , i );
 }
 }
 let pvy =(( ( loc.length)- 1 )* treesize.y )+ treepos.y ; 
 pv = createVector ( pvx , pvy );
 return pv ;
}
function getngnum (  txtoget  ,  nrooms ){
 // min0 ( nrooms - 2)
 let iout = 0 ;
 if ( txequal ( txtoget , "lmin" )) iout = 0 ;
 else if ( txequal ( txtoget , "lmax" )|| txequal ( txtoget , "pmin" )) iout = min0 ( nrooms - 2 );
 else if ( txequal ( txtoget , "pmax" )|| txequal ( txtoget , "smin" )) iout = min0 ( nrooms - 2 )+ 1 ;
 else if ( txequal ( txtoget , "smax" )) iout = min0 ( nrooms - 2 )+ 1 + min0 ( nrooms - 1 ); 
 return iout ;
}
function breakfzones (  fzone  ,  pline0  ,  pline1  ,  child1  ,  childx ){                // ZONE
 if  ( child1 && childx ) return new Zone ( fzone.pt [ 0 ] .copy (), createVector ( min0max1fl ( 0 , pline0 , fzone.pt [ 1 ] .x ), fzone.pt [ 1 ] .y ));
 else if ( child1 &&! childx ) return new Zone ( fzone.pt [ 0 ] .copy (), createVector ( fzone.pt [ 1 ] .x , min0max1fl ( 0 , pline0 , fzone.pt [ 1 ] .y )) );
 else if (! child1 && childx ) return new Zone ( createVector ( min0max1fl ( 1 , pline1 , fzone.pt [ 0 ] .x ), fzone.pt [ 0 ] .y ), fzone.pt [ 1 ] .copy ());
 else if (! child1 &&! childx ) return new Zone ( createVector ( fzone.pt [ 0 ] .x , min0max1fl ( 1 , pline1 , fzone.pt [ 0 ] .y )), fzone.pt [ 1 ] .copy ());// fzone.type
 else return null ;
}
function sortzonesbyarea (  inarr ){
 let tmp = inarr [  0 ] .cloneit ();
 for ( let i = 0 ; i < inarr.length ; i ++) for ( let j = i + 1 ; j < inarr.length ; j ++) if ( inarr [  i ] .area ()< inarr [  j ] .area ()){
  tmp = inarr [  i ];
  inarr [  i ]= inarr [  j ] ;
  inarr [  j ]= tmp  ;
 }
 return inarr ;
}
//                                                       NODE
//                                                relationships
function calcrelative (  n  ,  other  ,  relat ){// si es forloop normal? probar pareceque no no se necesita
 let relative = null ;
 if ( txequal ( relat , "father" )) for ( let o = 0 ; o < other.length ; o ++){
  if ( txequal ( n.loc.substring ( 0 , n.loc.length- 1 ), other [  o ] .loc )) relative = other [  o ];
 } else if ( txequal ( relat , "childa" )) for ( let o = 0 ; o < other.length ; o ++){
  if ( txequal ( n.loc + "0" , other [  o ] .loc )) relative = other [  o ];
 } else if ( txequal ( relat , "childb" )) for ( let o = 0 ; o < other.length ; o ++){
  if ( txequal ( n.loc + "1" , other [  o ] .loc )) relative = other [  o ];
 } else if ( txequal ( relat , "brother" )) for ( let o = 0 ; o < other.length ; o ++) if ( other [  o ] .nodei != n.nodei ){
  if ( txequal ( n.loc.substring ( 0 , n.loc.length- 1 ), other [  o ] .loc.substring ( 0 , other [  o ] .loc.length- 1 )) ) relative = other [  o ];
 }
 return relative ;
}
function calcbordertype (  allnodes  ,  no  ,  bo ){// 0:normal  , 1:entry 2:facade 3:introom   4:openning 5:door 6:window 7:wall 8: paramueble                   // calcbordertype
 let iout = 0 ; 
 if ( bo.adj != null ) if ( txequal ( no.ideals [ 9 ], allnodes [  bo.adj.id [ 0 ]] .code )) iout = 1 ;
 if ( bo.adj == null ) iout = 2 ;
 if ( bo.adj != null ) if ( bo.id [ 0 ]== bo.adj.id [ 0 ]) iout = 3 ;
 return iout ;
}
function calcbordertyperoom (  allnodes  ,  no ){// 0: mueblecentro 1:muebleapegado 2:noventananopuerta                   // calcbordertype
 if ( int ( no.ideals [ 10 ])== 0 ){// calcular fachada mas grande hacer ventana , calcular ultima zona entrada si esque no hay entrada poner puerta a otro cuarto , no olvidarse otras puertas
  let hasdoor = false ;
  for ( let z = 0 ; z < no.zones.length ; z ++) for ( let b = 0 ; b < no.zones [  z ] .borders.length ; b ++) if ( no.zones [  z ] .borders [  b ] .id [ 4 ]== 1 ) if (! hasdoor ){
  no.zones [  no.zones [  z ] .id [ 1 ]] .borders [  no.zones [  z ] .borders [  b ] .id [ 3 ]] .id [ 4 ]= 5 ;
  hasdoor = true ;
 }
  let haswindow = false ;
  for ( let z = 0 ; z < no.zones.length ; z ++) for ( let b = 0 ; b < no.zones [  z ] .borders.length ; b ++) if ( no.zones [  z ] .borders [  b ] .id [ 4 ]== 2 ) if ( bigborder ( no.zones [  z ] .borders [  b ], no.zones [  z ]) ) if (! haswindow ){
  no.zones [  no.zones [  z ] .id [ 1 ]] .borders [  no.zones [  z ] .borders [  b ] .id [ 3 ]] .id [ 4 ]= 6 ;
 // haswindow = true ;
 }
  for ( let z = 0 ; z < no.zones.length ; z ++) for ( let b = 0 ; b < no.zones [  z ] .borders.length ; b ++) if ( no.zones [  z ] .borders [  b ] .id [ 4 ]== 2 ) if (! haswindow ){
  no.zones [  no.zones [  z ] .id [ 1 ]] .borders [  no.zones [  z ] .borders [  b ] .id [ 3 ]] .id [ 4 ]= 6 ;
 // haswindow = true ;
 }
  for ( let z = 0 ; z < no.zones.length ; z ++) for ( let b = 0 ; b < no.zones [  z ] .borders.length ; b ++) if ( no.zones [  z ] .borders [  b ] .id [ 4 ]!= 5 && no.zones [  z ] .borders [  b ] .id [ 4 ]!= 6 && no.zones [  z ] .borders [  b ] .id [ 4 ]!= 8 && no.zones [  z ] .borders [  b ] .id [ 4 ]!= 3 ) no.zones [  no.zones [  z ] .id [ 1 ]] .borders [  no.zones [  z ] .borders [  b ] .id [ 3 ]] .id [ 4 ]= 7 ; 
 }    
 if ( int ( no.ideals [ 10 ])== 1 ){
  let hasdoor = false ;
  for ( let z = 0 ; z < no.zones.length ; z ++) for ( let b = 0 ; b < no.zones [  z ] .borders.length ; b ++) if ( no.zones [  z ] .borders [  b ] .id [ 4 ]== 1 ) if (! hasdoor ){
  no.zones [  no.zones [  z ] .id [ 1 ]] .borders [  no.zones [  z ] .borders [  b ] .id [ 3 ]] .id [ 4 ]= 5 ;
  hasdoor = true ;
 }
  let hasfurniture = false ;
  for ( let z = 0 ; z < no.zones.length ; z ++) for ( let b = 0 ; b < no.zones [  z ] .borders.length ; b ++) if ( no.zones [  z ] .borders [  b ] .id [ 4 ]!= 5 ) if ( bigborder ( no.zones [  z ] .borders [  b ], no.zones [  z ]) ) if (! hasfurniture ){
  no.zones [  no.zones [  z ] .id [ 1 ]] .borders [  no.zones [  z ] .borders [  b ] .id [ 3 ]] .id [ 4 ]= 8 ;
  hasfurniture = true ;
 }
  let haswindow = false ;
  for ( let z = 0 ; z < no.zones.length ; z ++) for ( let b = 0 ; b < no.zones [  z ] .borders.length ; b ++) if ( no.zones [  z ] .borders [  b ] .id [ 4 ]== 2 ) if ( bigborder ( no.zones [  z ] .borders [  b ], no.zones [  z ]) ) if (! haswindow ){
  no.zones [  no.zones [  z ] .id [ 1 ]] .borders [  no.zones [  z ] .borders [  b ] .id [ 3 ]] .id [ 4 ]= 6 ;
  haswindow = true ;
 }
  for ( let z = 0 ; z < no.zones.length ; z ++) for ( let b = 0 ; b < no.zones [  z ] .borders.length ; b ++) if ( no.zones [  z ] .borders [  b ] .id [ 4 ]== 2 ) if (! haswindow ){
  no.zones [  no.zones [  z ] .id [ 1 ]] .borders [  no.zones [  z ] .borders [  b ] .id [ 3 ]] .id [ 4 ]= 6 ;
  haswindow = true ;
 }
  for ( let z = 0 ; z < no.zones.length ; z ++) for ( let b = 0 ; b < no.zones [  z ] .borders.length ; b ++) if ( no.zones [  z ] .borders [  b ] .id [ 4 ]!= 5 && no.zones [  z ] .borders [  b ] .id [ 4 ]!= 6 && no.zones [  z ] .borders [  b ] .id [ 4 ]!= 8 && no.zones [  z ] .borders [  b ] .id [ 4 ]!= 3 ) no.zones [  no.zones [  z ] .id [ 1 ]] .borders [  no.zones [  z ] .borders [  b ] .id [ 3 ]] .id [ 4 ]= 7 ; 
 }
 if ( int ( no.ideals [ 10 ])== 2 ){   
  let hasentry = false ;
  for ( let z = 0 ; z < no.zones.length ; z ++) for ( let b = 0 ; b < no.zones [  z ] .borders.length ; b ++) if ( no.zones [  z ] .borders [  b ] .id [ 4 ]== 1 ) if ( bigborder ( no.zones [  z ] .borders [  b ], no.zones [  z ]) ) if (! hasentry ){
  no.zones [  no.zones [  z ] .id [ 1 ]] .borders [  no.zones [  z ] .borders [  b ] .id [ 3 ]] .id [ 4 ]= 4 ;
  hasentry = true ;
 }
  for ( let z = 0 ; z < no.zones.length ; z ++) for ( let b = 0 ; b < no.zones [  z ] .borders.length ; b ++) if ( no.zones [  z ] .borders [  b ] .id [ 4 ]== 0 ) if ( bigborder ( no.zones [  z ] .borders [  b ], no.zones [  z ]) ) if (! hasentry ){
  no.zones [  no.zones [  z ] .id [ 1 ]] .borders [  no.zones [  z ] .borders [  b ] .id [ 3 ]] .id [ 4 ]= 4 ;
  hasentry = true ;
 }
  for ( let z = 0 ; z < no.zones.length ; z ++) for ( let b = 0 ; b < no.zones [  z ] .borders.length ; b ++) if ( no.zones [  z ] .borders [  b ] .id [ 4 ]== 0 ) if (! hasentry ){
  no.zones [  no.zones [  z ] .id [ 1 ]] .borders [  no.zones [  z ] .borders [  b ] .id [ 3 ]] .id [ 4 ]= 4 ;
  hasentry = true ;
 }
  for ( let z = 0 ; z < no.zones.length ; z ++) for ( let b = 0 ; b < no.zones [  z ] .borders.length ; b ++) if ( no.zones [  z ] .borders [  b ] .id [ 4 ]!= 4 && no.zones [  z ] .borders [  b ] .id [ 4 ]!= 3 ) no.zones [  no.zones [  z ] .id [ 1 ]] .borders [  no.zones [  z ] .borders [  b ] .id [ 3 ]] .id [ 4 ]= 7 ;
 }
}
function bigborder (  bo  ,  zo ){
 let bout = true ;
 for ( let b = 0 ; b < zo.borders.length ; b ++) if ( zo.borders [  b ] .bsiz ()> bo.bsiz ()) bout = false ; 
 return bout ;
}
function bigbordertipe (  bo  ,  zo  ,  type ){
 let bout = true ;
 for ( let b = 0 ; b < zo.borders.length ; b ++) if ( zo.borders [  b ] .id [ 4 ]== type ) if ( zo.borders [  b ] .bsiz ()> bo.bsiz ()) bout = false ; 
 return bout ;
}
function adjlist (  onodes  ,  no ){
 let stout = "" ;
 let starr = new Array();
 for ( let z = 0 ; z < no.zones.length ; z ++) for ( let b = 0 ; b < no.zones [  z ] .borders.length ; b ++) if ( no.zones [  z ] .borders [  b ] .adj != null ) if (!( no.zones [  z ] .borders [  b ] .adj.id [ 0 ]== no.nodei )){
  let alreadyinlist = false ;
  let posadj = onodes [  no.zones [  z ] .borders [  b ] .adj.id [ 0 ]] .code ;
  for ( let s = 0 ; s < starr.length ; s ++) if ( txequal ( posadj , starr [  s ]) ) alreadyinlist = true ;
  if (! alreadyinlist ) starr.push ( posadj );
 }
 for ( let s = 0 ; s < starr.length ; s ++) stout += starr [  s ]+ " " ;
 if ( stout.length> 0 ) stout = stout.substring ( 0 , stout.length- 1 );
 return stout ;
}
function addfacadeadj (  no  ,  alladj  ,  faca ){                       // facadeadj
 // for ( let i = 0 ; i < faca.length ; i ++) alladj.push ( faca [  i ]); 
 for ( let i = 0 ; i < no.zones.length ; i ++) for ( let j = 0 ; j < faca.length ; j ++) for ( let l = 0 ; l < faca [  j ] .zones.length ; l ++){
  if ( isadj ( no.zones [  i ], faca [  j ] .zones [  l ]) ){
  let isalreadyinlist = false ;
  for ( let m = 0 ; m < alladj.length ; m ++) if ( txequal ( alladj [  m ] .loc , faca [  j ] .loc )) isalreadyinlist = true ;
  if (! isalreadyinlist ) alladj.push ( faca [  j ]);
 }
 }
 return alladj ;
}
function isadj (  a  ,  b ){                                        // adjs
 let bout = false ;
 if ( a.pt [ 0 ] .x == b.pt [ 1 ] .x && within ( a.pt [ 0 ], a.pt [ 1 ], b.pt [ 0 ], b.pt [ 1 ], 1 )) bout = true ;
 if ( a.pt [ 1 ] .x == b.pt [ 0 ] .x && within ( a.pt [ 0 ], a.pt [ 1 ], b.pt [ 0 ], b.pt [ 1 ], 1 )) bout = true ;
 if ( a.pt [ 0 ] .y == b.pt [ 1 ] .y && within ( a.pt [ 0 ], a.pt [ 1 ], b.pt [ 0 ], b.pt [ 1 ], 0 )) bout = true ;
 if ( a.pt [ 1 ] .y == b.pt [ 0 ] .y && within ( a.pt [ 0 ], a.pt [ 1 ], b.pt [ 0 ], b.pt [ 1 ], 0 )) bout = true ;
 return bout ;
}
// boolean isadjside ( Zone a , Zone b , int side ){
// boolean iout = false ;
// if ( side == 0 ) if ( a.pt [ 0 ] .x == b.pt [ 1 ] .x && within ( a.pt [ 0 ], a.pt [ 1 ], b.pt [ 0 ], b.pt [ 1 ], 1 )) iout = true ;
// if ( side == 1 ) if ( a.pt [ 1 ] .y == b.pt [ 0 ] .y && within ( a.pt [ 0 ], a.pt [ 1 ], b.pt [ 0 ], b.pt [ 1 ], 0 )) iout = true ;
// if ( side == 2 ) if ( a.pt [ 1 ] .x == b.pt [ 0 ] .x && within ( a.pt [ 0 ], a.pt [ 1 ], b.pt [ 0 ], b.pt [ 1 ], 1 )) iout = true ;
// if ( side == 3 ) if ( a.pt [ 0 ] .y == b.pt [ 1 ] .y && within ( a.pt [ 0 ], a.pt [ 1 ], b.pt [ 0 ], b.pt [ 1 ], 0 )) iout = true ;
// return iout ;
//}
function within (  a00  ,  a11  ,  b00  ,  b11  ,  x0y1 ){                        // within
 let bout = false ;
 let a0 , a1 , b0 , b1 ;
 if ( x0y1 == 0 ){
  a0 = a00.x ;
  a1 = a11.x ;
  b0 = b00.x ;
  b1 = b11.x ;
 } else {
  a0 = a00.y ;
  a1 = a11.y ;
  b0 = b00.y ;
  b1 = b11.y ;
 }
 if ( a0 < b0 && a1 > b0 ) bout = true ;
 if ( a0 < b1 && a1 > b1 ) bout = true ;
 if ( b0 < a0 && b1 > a0 ) bout = true ;
 if ( b0 < a1 && b1 > a1 ) bout = true ;
 if ( a0 == b0 ) bout = true ;
 if ( a1 == b1 ) bout = true ;
 return bout ;
}
function sameXY (  a  ,  b  ,  isx ){
 let bout = false ;
 if ( isx ) bout = a.x == b.x ;
 if (! isx ) bout = a.y == b.y ;
 return bout ;
}
function withinXY (  a0  ,  a1  ,  b  ,  isx ){
 let bout = false ;
 if ( isx ) bout = b.x > a0.x && b.x < a1.x ;
 if (! isx ) bout = b.y > a0.y && b.y < a1.y ; 
 return bout ;
}
function scaleno (  no  ,  sca ){
 for ( let n = 0 ; n < no.length ; n ++) for ( let z = 0 ; z < no [  n ] .zones.length ; z ++){
  let newp00 = no [  n ] .zones [  z ] .pt [ 0 ] .copy () .mult ( sqrt ( sca ));
  let newp11 = no [  n ] .zones [  z ] .pt [ 1 ] .copy () .mult ( sqrt ( sca )); 
  no [  n ] .zones [  z ]= no [  n ] .zones [  z ] .clonenewpts ( newp00 , newp11 ) ;
 }
}
function gridno (  no ){
 for ( let n = 0 ; n < no.length ; n ++) for ( let z = 0 ; z < no [  n ] .zones.length ; z ++){ 
  let newp00 = createVector ( rg ( no [  n ] .zones [  z ] .pt [ 0 ] .x ), rg ( no [  n ] .zones [  z ] .pt [ 0 ] .y ));
  let newp11 = createVector ( rg ( no [  n ] .zones [  z ] .pt [ 1 ] .x ), rg ( no [  n ] .zones [  z ] .pt [ 1 ] .y ));
  no [  n ] .zones [  z ]= no [  n ] .zones [  z ] .clonenewpts ( newp00 , newp11 ) ;
 }
}
function calcstrechfactor (  no ){
 let scfactor = 1 ;
 let totidealarea = 0 ;
 let tothousearea = 0 ;
 for ( let n = 0 ; n < no.length ; n ++) if ( no [  n ] .isleaf ) totidealarea += float ( no [  n ] .ideals [ 2 ]);
 for ( let n = 0 ; n < no.length ; n ++) if ( no [  n ] .isleaf ) for ( let z = 0 ; z < no [  n ] .zones.length ; z ++) tothousearea += no [  n ] .zones [  z ] .area ();
 if ( totidealarea != 0 && tothousearea != 0 ) scfactor = totidealarea / tothousearea ;
 return scfactor ;
}
function removeemptyzones (  no ){
 for ( let n = 0 ; n < no.length ; n ++) if ( no [  n ] .isleaf ) for ( let z = 0 ; z < no [  n ] .zones.length ; z ++){         // delete 00 zones
  let p00 = no [  n ] .zones [  z ] .pt [ 0 ];
  let p11 = no [  n ] .zones [  z ] .pt [ 1 ];
  if ( p00.x == p11.x || p00.y == p11.y ) no [  n ] .zones.remove ( z );
 }
 for ( let n = 0 ; n < no.length ; n ++) if ( no [  n ] .isleaf ) for ( let z = 0 ; z < no [  n ] .zones.length ; z ++) no [  n ] .zones [  z ] .id [ 1 ]= z ;
}
function colorDEcode (  code  ,  transp  ,   roomDATA ){                  
 let colprim = 255 / 2 ;
 if ( code != null ) for ( let i = 0 ; i < roomDATA.length ; i ++) if ( txequal ( code , roomDATA [ i ][ 0 ])) colprim = map ( i , 0 , roomDATA.length , 0 , 255 );
 noStroke ();
 colorMode ( HSB );
 fill ( colprim , 255 , 255 , transp );
 colorMode ( RGB );
}
// void drawperimeterlines ( ArrayList < Zone > zones ){
// for ( Zone z1 : zones ){
// FloatList linevals = new FloatList ( z1.pt [ 0 ] .x , z1.pt [ 1 ] .x , z1.pt [ 0 ] .y , z1.pt [ 1 ] .y );
// FloatList pointsvals []= new FloatList [ 4 ];
// pointsvals [ 0 ]= new FloatList ( z1.pt [ 0 ] .y , z1.pt [ 1 ] .y );
// pointsvals [ 1 ]= new FloatList ( z1.pt [ 0 ] .y , z1.pt [ 1 ] .y );
// pointsvals [ 2 ]= new FloatList ( z1.pt [ 0 ] .x , z1.pt [ 1 ] .x );
// pointsvals [ 3 ]= new FloatList ( z1.pt [ 0 ] .x , z1.pt [ 1 ] .x );
// for ( Zone z2 : zones ) if ( z1.id [ 1 ]!= z2.id [ 1 ]) if (( linevals.get ( 0 )== z2.pt [ 1 ] .x )) pointsvals [ 0 ] .append ( z2.pt [ 0 ] .y ); 
// for ( Zone z2 : zones ) if ( z1.id [ 1 ]!= z2.id [ 1 ]) if (( linevals.get ( 0 )== z2.pt [ 1 ] .x )) pointsvals [ 0 ] .append ( z2.pt [ 1 ] .y ); 
// for ( Zone z2 : zones ) if ( z1.id [ 1 ]!= z2.id [ 1 ]) if (( linevals.get ( 1 )== z2.pt [ 0 ] .x )) pointsvals [ 1 ] .append ( z2.pt [ 0 ] .y ); 
// for ( Zone z2 : zones ) if ( z1.id [ 1 ]!= z2.id [ 1 ]) if (( linevals.get ( 1 )== z2.pt [ 0 ] .x )) pointsvals [ 1 ] .append ( z2.pt [ 1 ] .y ); 
// for ( Zone z2 : zones ) if ( z1.id [ 1 ]!= z2.id [ 1 ]) if (( linevals.get ( 2 )== z2.pt [ 1 ] .y )) pointsvals [ 2 ] .append ( z2.pt [ 0 ] .x ); 
// for ( Zone z2 : zones ) if ( z1.id [ 1 ]!= z2.id [ 1 ]) if (( linevals.get ( 2 )== z2.pt [ 1 ] .y )) pointsvals [ 2 ] .append ( z2.pt [ 1 ] .x ); 
// for ( Zone z2 : zones ) if ( z1.id [ 1 ]!= z2.id [ 1 ]) if (( linevals.get ( 3 )== z2.pt [ 0 ] .y )) pointsvals [ 3 ] .append ( z2.pt [ 0 ] .x ); 
// for ( Zone z2 : zones ) if ( z1.id [ 1 ]!= z2.id [ 1 ]) if (( linevals.get ( 3 )== z2.pt [ 0 ] .y )) pointsvals [ 3 ] .append ( z2.pt [ 1 ] .x ); 
// for ( int s = 0 ; s < 4 ; s ++) pointsvals [ s ] .sort ();
// for ( int s = 0 ; s < 2 ; s ++) for ( int i = 0 ; i < pointsvals [ s ] .size (); i ++) if ( i % 2 == 0 ) line ( scgrfx ( linevals.get ( s )), scgrfy ( pointsvals [ s ] .get ( i )), scgrfx ( linevals.get ( s )), scgrfy ( pointsvals [ s ] .get ( i + 1 )) );
// for ( int s = 2 ; s < 4 ; s ++) for ( int i = 0 ; i < pointsvals [ s ] .size (); i ++) if ( i % 2 == 0 ) line ( scgrfx ( pointsvals [ s ] .get ( i )), scgrfy ( linevals.get ( s )), scgrfx ( pointsvals [ s ] .get ( i + 1 )), scgrfy ( linevals.get ( s )) );
//}
//}
//                         CLONES
function  cloneintarr (  inarr ){
 let outarr  = new Array ( inarr.length );
 for ( let i = 0 ; i < outarr.length ; i ++) outarr [ i ]= inarr [ i ];
 return outarr ;
}
function  clonevecarr (  inarr ){
 let outarr  = new Array ( inarr.length );
 for ( let i = 0 ; i < outarr.length ; i ++) outarr [ i ]= inarr [ i ] .copy ();
 return outarr ;
}
function  clonestarr (   stin ){
 let  stout  = new Array ( stin.length );
 for ( let i = 0 ; i < stin.length ; i ++) stout [ i ]= stin [ i ];
 return stout ;
}
function cloneborderslist (  bin ){
 let bout = new Array();
 if ( bin != null ) for ( let i = 0 ; i < bin.length ; i ++) bout.push ( bin [  i ] .cloneit ());
 return bout ;
}
function clonemuebles (  bin ){
 let bout = new Array();
 if ( bin != null ) for ( let i = 0 ; i < bin.length ; i ++) bout.push ( bin [  i ] .cloneit ());
 return bout ;
}
//                         INT
//                            factorials
function factorial (  num ){
 if ( num > 12 ) print ( "numero factorial muy grande" );
 return fact ( num );
}
function fact (  num ){
 if ( num <= 1 ) return 1 ;
 else return num * fact ( num - 1 );
}           
function min0 (  num ){
 if ( num >= 0 ) return num ;
 else return 0 ;
}
//                         FLOAT
function roundit (  numin  ,  dec ){                // round
 let dec10 = pow ( 10 , dec );
 let roundout = round ( numin * dec10 )/ dec10 ;
 return roundout ;
}
function roundspan (  fin  ,  spanu ){
 let fout = fin + spanu * .5 ;
 fout = roundit ( fout -( fout % spanu ), 2 );
 return fout ;
}
function avgflot (  a  ,  b ){
 return a * .5 + b * .5 ;
}
function wavgflot (  a  ,  b  ,  wa ){
 return a * wa + b *( 1 - wa );
}
function divNaN0 (  a  ,  b ){
 if ( a == 0 && b == 0 ) return 0 ;
 else return a / b ;
} 
function  ranflarr (  num  ,  minV  ,  maxV ){           // random array
 let rout  = new Array ( num );
 for ( let i = 0 ; i < rout.length ; i ++) rout [ i ]= random ( minV , maxV );
 return rout ;
}
function min0max1fl (  min0max1  ,  a  ,  b ){
 let fout ;
 if (( min0max1 == 0 && a < b )||( min0max1 == 1 && a > b )) fout = a ;
 else fout = b ;
 return fout ;
}
// VECTOR
function avgvector (  a  ,  b ){
 return createVector ( a.x * .5 + b.x * .5 , a.y * .5 + b.y * .5 );
}
function wavgvector (  a  ,  b  ,  wa ){
 return createVector ( a.x * wa + b.x *( 1 - wa ), a.y * wa + b.y *( 1 - wa ));
}
//                         STRING
//                            equal
function txequal (  a  ,  b ){
 if ( a == null || b == null ) return false ;
 else {
  let al = a.length;
  let bl = b.length;
  let minl ;
  let bout = true ;
  if ( al != bl ) bout = false ;
  if ( al < bl ) minl = al ;
  else minl = bl ;
  for ( let i = 0 ; i < minl ; i ++) if ( a.charAt ( i )!= b.charAt ( i )) bout = false ; 
  return bout ;
 }
}
function removeemptyst (  stin ){
 let stout = new Array();
 for ( let i = 0 ; i < stin.length ; i ++) if (! txequal ( stin [  i ], "" )) stout.push ( stin [  i ]);
 return stout ;
}
function  removeemptystarr (   stin ){
 let stout = new Array();
 for ( let i = 0 ; i < stin.length ; i ++) if (! txequal ( stin [ i ], "" )) stout.push ( stin [ i ]);
 let starrout  = new Array ( stout.length );
 for ( let i = 0 ; i < starrout.length ; i ++) starrout [ i ]= stout [  i ];
 return starrout ;
} 
function  subtostarr (   stin  ,  strremove ){
 let stout = new Array();
 for ( let i = 0 ; i < stin.length ; i ++) if (! txequal ( stin [ i ], strremove )) stout.push ( stin [ i ]);
 let starrout  = new Array ( stout.length );
 for ( let i = 0 ; i < starrout.length ; i ++) starrout [ i ]= stout [  i ];
 starrout = getroomNAMES ( starrout );
 return starrout ;
}
function  addtostarr (   inarr  ,  newstr ){// addtostarr
 let stout  = new Array ( inarr.length + 1 );
 for ( let i = 0 ; i < inarr.length ; i ++) stout [ i ]= inarr [ i ];
 stout [ inarr.length ]= newstr ;
 stout = getroomNAMES ( stout );
 return stout ;
}
//                             permutations
function  permutation01 (   pre  ,  num ){
 let numin = factorial ( pre.length )- 1 ;
 if ( num < 1 ) numin = int ( map ( num , 0 , 1 , 0 , factorial ( pre.length )) ); 
 let newA = perm ( pre , 0 , new Array(), numin );
 return newA ;
}
function  perm (   iA  ,  s  ,  igm  ,  nume ){ 
 for ( let i = s ; i < iA.length ; i ++){
  let temp = iA [ s ];
  iA [ s ]= iA [ i ];
  iA [ i ]= temp ;
  perm ( iA , s + 1 , igm , nume );
  iA [ i ]= iA [ s ];
  iA [ s ]= temp ;
 }
 if ( s == iA.length - 1 ){
  let toadd = "" ;
  for ( let i = 0 ; i < iA.length - 1 ; i ++) toadd = toadd + iA [ i ]+ " , " ;
  toadd = toadd + iA [ iA.length - 1 ]; 
  igm.push ( split ( toadd , " , " ));
 }
 let  ig1 = null ;
 if ( igm.length > nume ) ig1 = igm [  nume ];
 return ig1 ;
}
function vectorsequal (  a  ,  b ){
 return a.x == b.x && a.y == b.y ;
}
function daline (  a  ,  b  ,  space ){
 let distper =( space / p5.Vector.dist ( a , b ))/ 2 ;
 let odd = true ;
 for ( let i = 0 ; i < 1 ; i += distper ){
  let nexti = i + distper ;
  let p1 = createVector ( b.x * i + a.x *( 1 - i ), b.y * i + a.y *( 1 - i ));
  let p2 = createVector ( b.x * nexti + a.x *( 1 - nexti ), b.y * nexti + a.y *( 1 - nexti ));
  if ( p5.Vector.dist ( p2 , p1 )< p5.Vector.dist ( b , p1 )) if ( odd ) line ( p1.x , p1.y , p2.x , p2.y );
  if ( p5.Vector.dist ( p2 , p1 )>= p5.Vector.dist ( b , p1 )) if ( odd ) line ( p1.x , p1.y , b.x , b.y );
  odd =! odd ;
 }
}



class Click {
 constructor (  _pos  ,  _size  ,  _name  ,  _type ){
  this.pos , this.size , this.mid , this.end ;
  this.name ;
  this.state , this.displaystate ;
  this.type = 0 ;
  this.icon = 0 ;
  this.textsize = 12 ;
  scand = 1 ;
  this.con = 200 ;
  this.coff = 100 ;
  this.pos = _pos ;
  this.size = _size ;
  this.calcpos ();
  this.name = _name ;
  this.type = _type ;
 }
  calcpos (){
  this.mid = createVector ( this.pos.x + this.size.x / 2 , this.pos.y + this.size.y / 2 );
  this.end = createVector ( this.pos.x + this.size.x , this.pos.y + this.size.y );
 }
  scaletoandroid (  _scand ){
  scand = _scand ;
  this.pos = createVector ( scand * this.pos.x , scand * this.pos.y );
  this.size = createVector ( scand * this.size.x , scand * this.size.y );
  this.mid = createVector ( scand * this.mid.x , scand * this.mid.y );
  this.end = createVector ( scand * this.end.x , scand * this.end.y );
  this.textsize = this.textsize * scand ;
 }
  display (){
  push ();
  rectMode ( CORNER );
  textAlign ( CENTER , CENTER );
  textSize ( this.textsize );
  stroke ( this.coff );
  strokeWeight ( 1 * scand );
  noFill ();
  if ( frameCount % 30 == 0 ) this.displaystate = false ;
  if ( this.isover ()) strokeWeight ( 2 * scand );
  if ( this.type == 10 || this.type == 11 ){        // boton vacio texto afuera derecha = 0 abajo = 1
  if ( this.displaystate ) noStroke ();
  if ( this.displaystate ) fill ( this.con );
  ellipse ( this.mid.x , this.mid.y , this.size.x , this.size.y );
  fill ( this.coff );
  noStroke ();
  if ( this.type == 10 ) textAlign ( LEFT , CENTER );
  if ( this.type == 10 ) text ( this.name , this.end.x +( this.size.x * .3 ), this.mid.y );
  if ( this.type == 11 ) textAlign ( CENTER , CENTER );
  if ( this.type == 11 ) text ( this.name , this.mid.x , this.end.y +( this.textsize * .8 ));
  stroke ( this.coff );
 }

  if ( this.type == 20 || this.type == 21 ){        // // boton redondeado = 20 redondeado cuadrado = 21 vacio texto adentro
  stroke ( this.coff );
  if ( this.displaystate ) noStroke ();
  if ( this.displaystate ) fill ( this.con );
  if ( this.type == 20 ) fill ( 229,223,223),rect ( this.pos.x , this.pos.y , this.size.x , this.size.y , this.size.y / 2 );
  if ( this.type == 21 ) rect ( this.pos.x , this.pos.y , this.size.x , this.size.y , this.size.y / 4 );
  textAlign ( CENTER , CENTER );
  if ( this.displaystate ) fill ( 255 );
  else fill ( this.coff );
  noStroke ();
  text ( this.name , this.mid.x , this.mid.y );
 }
  if ( this.type == 30 || this.type == 31 ){        // boton icono texto abajo
  if ( this.displaystate ) noStroke ();
  if ( this.displaystate ) fill ( this.con );
  ellipse ( this.mid.x , this.mid.y , this.size.x , this.size.y );
  if ( this.displaystate ) fill ( 255 );
  if (! this.displaystate ) fill ( this.coff );
  drawicon ( this.icon , this.mid , this.size );
  fill ( this.coff );
  if ( this.displaystate ) fill ( this.con );
  if ( this.type == 30 ) textAlign ( CENTER , CENTER );
  noStroke ();
  if ( this.type == 30 ) text ( this.name , this.mid.x , this.end.y + this.size.y * .15 );
  if ( this.type == 31 ) textAlign ( LEFT , CENTER );
  if ( this.type == 31 ) if ( this.isover ()) text ( this.name , this.end.x + this.size.x * .2 , this.mid.y );
 }
  if ( this.type == 32 ){        // boton solo icono
  if ( this.displaystate ) noStroke ();
  if ( this.displaystate ) fill ( this.con );
  if (! this.displaystate ) fill ( this.coff );
  drawicon ( this.icon , this.mid , this.size );
 }
  if ( this.type == 40 ){        // solo texto aparece boton
  stroke ( this.coff );
  if ( this.displaystate ) noStroke ();
  if ( this.displaystate ) fill ( this.con );
  if ( this.displaystate ) rect ( this.pos.x , this.pos.y , this.size.x , this.size.y , this.size.y / 4 );
  textAlign ( CENTER , CENTER );
  if ( this.displaystate ) fill ( 255 );
  else fill ( this.coff );
  noStroke ();
  text ( this.name , this.mid.x , this.mid.y );
 }
  if ( this.type == 41 ){          // texto sobre linea
  textAlign ( CENTER , CENTER );
  if ( this.displaystate ) fill ( this.con );
  else fill ( this.coff );
  if ( this.isover ()) strokeWeight ( 2 * scand );
  else strokeWeight ( 1 * scand );
  noStroke ();
  text ( this.name , this.mid.x , this.mid.y ); 
  line ( this.pos.x , this.end.y , this.end.x , this.end.y );
 }
  strokeWeight ( 1 * scand );
  pop ();
 }
  isover (){
  return ( mouseX > this.pos.x && mouseX < this.end.x && mouseY > this.pos.y && mouseY < this.end.y );
 }
  isoverandpressed (){
  return ( this.isover ()&& mousePressed == true );
 }
  presson (){
  if ( this.isover ()) this.state = true ;
  if ( this.isover ()) this.displaystate = true ;
 }
  pressoff (){
  if ( this.isover ()) this.state = false ;
 }
}



class Toggle {
 constructor (  _pos  ,  _size  ,  _name  ,  _type ){
  this.pos , this.size , this.mid , this.end , this.poshide , this.posshow ;
  this.name ;
  this.state ;
  this.type = 0 ;
  this.icon = 0 ;
  this.textsize = 12 ;
  scand = 1 ;
  this.con = 200 ;
  this.coff = 100 ;
  this.pos = _pos ;
  this.size = _size ;
  this.calcpos ();
  this.name = _name ;
  this.type = _type ;
  this.poshide = this.pos ;
  this.posshow = this.pos ;
 }


  calcpos (){
  this.mid = createVector ( this.pos.x + this.size.x / 2 , this.pos.y + this.size.y / 2 );
  this.end = createVector ( this.pos.x + this.size.x , this.pos.y + this.size.y );
 }
  calcposhide (  _posshow ){
  this.poshide = this.pos ;
  this.posshow = _posshow ;
 }
  scaletoandroid (  _scand ){
  scand = _scand ;
  this.pos = createVector ( scand * this.pos.x , scand * this.pos.y );
  this.size = createVector ( scand * this.size.x , scand * this.size.y );
  this.mid = createVector ( scand * this.mid.x , scand * this.mid.y );
  this.end = createVector ( scand * this.end.x , scand * this.end.y );
  this.poshide = createVector ( scand * this.poshide.x , scand * this.poshide.y );
  this.posshow = createVector ( scand * this.posshow.x , scand * this.posshow.y );
  this.textsize = this.textsize * scand ;
 }
  display (){
  push ();
  textSize ( this.textsize );
  rectMode ( CORNER );


  if ( this.type == 10 || this.type == 11 || this.type == 12 ){
  stroke ( this.coff );
  fill ( 255 );
  rect ( this.pos.x , this.pos.y , this.size.x , this.size.y , this.size.y );
  strokeWeight ( 1 * scand );
  if ( this.isover ()) strokeWeight ( 2 * scand );
  if (! this.state ){
   stroke ( this.coff );
   fill ( 255 );
   ellipse ( this.pos.x +( this.size.y * .5 ), this.mid.y , this.size.y * 1.05 , this.size.y * 1.05 );
 } else {
   noStroke ();
   fill ( this.con );
   rect ( this.pos.x , this.pos.y , this.size.x , this.size.y , this.size.y ); 
   fill ( 255 );
   stroke ( this.coff );
   ellipse ( this.end.x -( this.size.y * .5 ), this.pos.y +( this.size.y * .5 ), this.size.y * 1.05 , this.size.y * 1.05 );
 } 
  fill ( this.coff );
  noStroke ();
  if ( this.type == 11 ) textAlign ( CENTER , CENTER );
  if ( this.type == 11 ) text ( this.name , this.mid.x , this.end.y + this.textsize * .8 );
  if ( this.type == 12 ) textAlign ( LEFT , CENTER );
  if ( this.type == 12 ) text ( this.name , this.end.x + this.textsize * .8 , this.mid.y );
 }

 //icon of draw perimeter
  if ( this.type == 20 || this.type == 21 ){  // boton icono this.con texto
  stroke ( this.coff );
  noFill ();
  strokeWeight ( 1 * scand );
  if ( this.isover ()) strokeWeight ( 2 * scand );
  if ( this.state ) fill ( this.con );
  if ( this.state ) noStroke ();
  ellipse ( this.mid.x , this.mid.y , this.size.x , this.size.y );
  fill ( this.coff );
  if ( this.state ) {
    fill ( this.coff );
    if ( this.type == 20 ) textAlign ( CENTER , CENTER );
    if ( this.type == 20 ) text ( "Switch" , this.mid.x , this.end.y + this.textsize * .8 );

  }
  else{
    if ( this.type == 20 ) textAlign ( CENTER , CENTER );
    if ( this.type == 20 ) {
      strokeWeight(0.1  )
      text ( this.name , this.mid.x , this.end.y + this.textsize * .8 );
    }

  }
  text ( "download plan" , this.mid.x , this.end.y + this.textsize * .8+60 );
  if ( this.state ) noStroke ();
  //icon of pencil
  drawicon ( this.icon , createVector(this.mid.x,this.mid.y) , this.size );
  // textAlign ( CENTER , CENTER );
  // fill ( this.coff );
  // noStroke ();
  // if ( this.type == 20 ) textAlign ( CENTER , CENTER );
  // if ( this.type == 20 ) text ( this.name , this.mid.x , this.end.y + this.textsize * .8 );
  if ( this.type == 21 ) textAlign ( LEFT , CENTER );
  if ( this.type == 21 ) text ( this.name , this.end.x + this.textsize * .8 , this.mid.y );
 }


  if ( this.type == 22 ){
  stroke ( this.coff );
  noFill ();
  strokeWeight ( 1 * scand );
  if ( this.isover ()) strokeWeight ( 2 * scand );
  if ( this.state ) fill ( this.con );
  if ( this.state ) noStroke ();
  if ( this.state ) ellipse ( this.pos.x +( this.size.y * .5 ), this.pos.y +( this.size.y * .5 ), this.size.x * 1.05 , this.size.y * 1.05 );
  fill ( this.coff );
  if ( this.state ) fill ( this.coff );
  if ( this.state ) noStroke ();
  let a = createVector ( this.pos.x +( this.size.x * .5 ), this.pos.y +( this.size.y * .5 ));
  drawicon ( this.icon , a , this.size );
  textAlign ( CENTER , CENTER );
  if ( this.state ) fill ( this.con );
  else fill ( this.coff );
  noStroke ();
  text ( this.name , this.pos.x +( this.size.x * .5 ), this.end.y + this.textsize * .8 );
 }

 
  if ( this.type == 30 || this.type == 31 ){      // show hide bar horizontal
  stroke ( this.coff );
  fill ( 255 );
  strokeWeight ( 1 * scand );
  if ( this.isover ()) strokeWeight ( 2 * scand );
  if (! this.state ){
   rect ( this.poshide.x , this.poshide.y , this.size.x , this.size.y );
   if ( this.type == 30 ) line ( this.pos.x + this.size.x * .5 - 7 * scand , this.pos.y + this.size.y * .5 , this.pos.x + this.size.x * .5 , this.pos.y + this.size.y * .5 + 7 * scand );
   if ( this.type == 30 ) line ( this.pos.x + this.size.x * .5 + 7 * scand , this.pos.y + this.size.y * .5 , this.pos.x + this.size.x * .5 , this.pos.y + this.size.y * .5 + 7 * scand );
   if ( this.type == 31 )  line ( this.pos.x +( this.size.x * .4 ), this.pos.y + this.size.y * .5 -( 7 * scand ), this.pos.x +( this.size.x * .7 ), this.pos.y + this.size.y * .5 );
   if ( this.type == 31 ) line ( this.pos.x +( this.size.x * .4 ), this.pos.y + this.size.y * .5 +( 7 * scand ), this.pos.x +( this.size.x * .7 ), this.pos.y + this.size.y * .5 );
 }
  if ( this.state ){
   rect ( this.poshide.x , this.poshide.y , this.posshow.x - this.poshide.x + this.size.x , this.posshow.y - this.poshide.y + this.size.y );
   if ( this.type == 30 ) line ( this.pos.x + this.size.x * .5 - 7 * scand , this.pos.y + this.size.y * .5 + 7 * scand , this.pos.x + this.size.x * .5 , this.pos.y + this.size.y * .5 );
   if ( this.type == 30 ) line ( this.pos.x + this.size.x * .5 + 7 * scand , this.pos.y + this.size.y * .5 + 7 * scand , this.pos.x + this.size.x * .5 , this.pos.y + this.size.y * .5 );
   if ( this.type == 31 ) line ( this.pos.x +( this.size.x * .7 ), this.pos.y + this.size.y * .5 -( 7 * scand ), this.pos.x +( this.size.x * .4 ), this.pos.y + this.size.y * .5 );
   if ( this.type == 31 ) line ( this.pos.x +( this.size.x * .7 ), this.pos.y + this.size.y * .5 +( 7 * scand ), this.pos.x +( this.size.x * .4 ), this.pos.y + this.size.y * .5 );
 }
 }

  if ( this.type == 40 ){
  stroke ( this.coff );
  fill ( this.coff );
  strokeWeight ( 1 * scand );
  if ( this.isover ()) strokeWeight ( 2 * scand );
  if ( this.state ) fill ( this.con );
  if ( this.state ) stroke ( this.con );
  line ( this.pos.x , this.end.y , this.end.x , this.end.y );
  textAlign ( CENTER , CENTER );
  noStroke ();
  text ( this.name , this.pos.x +( this.size.x * .5 ), this.pos.y +( this.size.y * .5 ));
 }
  if ( this.type == 50 ){// candado
  noStroke (); 
  fill ( this.con );
  if ( this.state ) fill ( this.coff );
  let a = createVector ( this.pos.x +( this.size.x * .5 ), this.pos.y +( this.size.y * .5 ));
  if ( this.state ) drawicon ( 17 , a , this.size );
  else drawicon ( 16 , a , this.size );
 }
  pop ();
 }
  turnon (){
  this.state = true ;
  if ( this.type == 30 || this.type == 31 ){
  this.pos = createVector ( this.posshow.x , this.posshow.y );
  this.calcpos ();
  
 }
 }
  turnoff (){
  this.state = false ;
  if ( this.type == 30 || this.type == 31 ){
  this.pos = createVector ( this.poshide.x , this.poshide.y );
  this.calcpos ();
 }
 }
  press (){
  if ( this.type != 30 && this.type != 31 ) if ( this.isover ()) this.state =! this.state ;
  if ( this.type == 30 || this.type == 31 ) if ( this.isover ()) if (! this.state ) this.turnon ();
  if ( this.type == 30 || this.type == 31 ) if ( this.isover ()) if ( this.state ) this.turnoff ();
 }
  isover (){
  // if ( this.type == 20 || this.type == 21 ){ 
  //   if ( mouseX > this.pos.x+10 && mouseX < this.end.x+10 && mouseY > this.pos.y-500 && mouseY < this.end.y-500 ) return true ;
  //   else return false ;
  // }
  // else{
    if ( mouseX > this.pos.x && mouseX < this.end.x && mouseY > this.pos.y && mouseY < this.end.y ) return true ;
    else return false ;
  // }
    
 }
}

//for dropdowns in entry , adding and deleting rooms
class Option {

 constructor (  _pos  ,  _size  ,  _names  ,  _type ){
  this.pos , this.size , this.mid , this.end , this.ipos , this.imid , this.iend ;
   this.names ;
  this.state , this.displaystate ;
  this.type = 0 ;
  this.namei = 0 ;
  this.icon = 0 ;
  this.textsize = 12 ;
  scand = 1 ;
  this.con = 100 ;
  this.coff = 200 ;
  this.pos = _pos ;
  this.size = _size ;
  this.names = _names ;
  this.type = _type ;
  this.calcpos ();
  if ( this.type == 11 || this.type == 13 ) this.namei =- 1 ;
 }

 
  calcpos (){
  this.mid = createVector ( this.pos.x + this.size.x / 2 , this.pos.y + this.size.y / 2 );
  this.end = createVector ( this.pos.x + this.size.x , this.pos.y + this.size.y );
  this.calcipos ( this.type );
 }


  scaletoandroid (  _scand ){
  scand = _scand ;
  this.pos = createVector ( this.pos.x * scand , this.pos.y * scand );
  this.size = createVector ( this.size.x * scand , this.size.y * scand );
  this.textsize = this.textsize * scand ;
  this.calcpos ();
 }


  calcipos (  type ){

  if ( this.type == 10 || this.type == 12 ){
  this.ipos  = new Array ( this.names.length );
  this.imid  = new Array ( this.names.length );
  this.iend  = new Array ( this.names.length );
  for ( let i = 0 ; i < this.ipos.length ; i ++) if ( i == this.namei ) this.ipos [ i ]= createVector ( this.pos.x , this.pos.y );
  for ( let i = 0 ; i < this.ipos.length ; i ++) if ( i < this.namei ) this.ipos [ i ]= createVector ( this.pos.x , this.pos.y +( i * this.size.y )+ this.size.y );
  for ( let i = 0 ; i < this.ipos.length ; i ++) if ( i > this.namei ) this.ipos [ i ]= createVector ( this.pos.x , this.pos.y +( i * this.size.y ));
  for ( let i = 0 ; i < this.imid.length ; i ++) if ( i == this.namei ) this.imid [ i ]= createVector ( this.pos.x + this.size.x * .5 , this.pos.y + this.size.y * .5 );
  for ( let i = 0 ; i < this.imid.length ; i ++) if ( i < this.namei ) this.imid [ i ]= createVector ( this.pos.x + this.size.x * .5 , this.pos.y +( i * this.size.y )+ this.size.y * 1.5 );
  for ( let i = 0 ; i < this.imid.length ; i ++) if ( i > this.namei ) this.imid [ i ]= createVector ( this.pos.x + this.size.x * .5 , this.pos.y +( i * this.size.y )+ this.size.y * 0.5 );
  for ( let i = 0 ; i < this.iend.length ; i ++) if ( i == this.namei ) this.iend [ i ]= createVector ( this.pos.x + this.size.x , this.pos.y + this.size.y );
  for ( let i = 0 ; i < this.iend.length ; i ++) if ( i < this.namei ) this.iend [ i ]= createVector ( this.pos.x + this.size.x , this.pos.y +( i * this.size.y )+ this.size.y * 2 );
  for ( let i = 0 ; i < this.iend.length ; i ++) if ( i > this.namei ) this.iend [ i ]= createVector ( this.pos.x + this.size.x , this.pos.y +( i * this.size.y )+ this.size.y * 1 );
 }


  if ( this.type == 11 ){
  this.ipos  = new Array ( this.names.length );
  this.imid  = new Array ( this.names.length );
  this.iend  = new Array ( this.names.length );
  for ( let i = 0 ; i < this.ipos.length ; i ++) this.ipos [ i ]= createVector ( this.pos.x , this.pos.y + this.size.y +( this.size.y * i ));
  for ( let i = 0 ; i < this.imid.length ; i ++) this.imid [ i ]= createVector ( this.pos.x +( this.size.x * .5 ), this.pos.y + this.size.y +( this.size.y * i )+( this.size.y * .5 ));
  for ( let i = 0 ; i < this.iend.length ; i ++) this.iend [ i ]= createVector ( this.pos.x +( this.size.x ), this.pos.y + this.size.y +( this.size.y * i )+( this.size.y ));
  
 }

if ( this.type == 13 ){
  this.ipos  = new Array ( this.names.length );
  this.imid  = new Array ( this.names.length );
  this.iend  = new Array ( this.names.length );
  for ( let i = 0 ; i < this.ipos.length ; i ++) this.ipos [ i ]= createVector ( this.pos.x + this.size.x + this.size.x * i , this.pos.y );
  for ( let i = 0 ; i < this.imid.length ; i ++) this.imid [ i ]= createVector ( this.pos.x + this.size.x + this.size.x * i + this.size.x * .5 , this.pos.y + this.size.y * .5 );
  for ( let i = 0 ; i < this.iend.length ; i ++) this.iend [ i ]= createVector ( this.pos.x + this.size.x + this.size.x * i + this.size.x , this.pos.y + this.size.y );
 }

if ( this.type == 20 || this.type == 30 || this.type == 31 ){
  this.ipos  = new Array ( this.names.length );
  this.imid  = new Array ( this.names.length );
  this.iend  = new Array ( this.names.length );
  for ( let i = 0 ; i < this.ipos.length ; i ++) this.ipos [ i ]= createVector ( this.pos.x +( this.size.x * i ), this.pos.y );
  for ( let i = 0 ; i < this.imid.length ; i ++) this.imid [ i ]= createVector ( this.pos.x +( this.size.x * i )+( this.size.x * .5 ), this.pos.y +( this.size.y * .5 ));
  for ( let i = 0 ; i < this.iend.length ; i ++) this.iend [ i ]= createVector ( this.pos.x +( this.size.x * i )+( this.size.x ), this.pos.y +( this.size.y ));
 }
 }


  display (){


  push ();
  textSize ( this.textsize );
  if ( this.type == 10 ){
  stroke ( this.con );
  if ( this.isover ()) strokeWeight ( 2 * scand );
  else strokeWeight ( 1 * scand );
  fill ( 255 );
  textAlign ( RIGHT , CENTER );
  noFill ();
  strokeWeight ( 1 );
  if ( this.state ){
   for ( let i = 0 ; i < this.ipos.length ; i ++){
    if ( this.isoveri ( i )) strokeWeight ( 2 );
    else strokeWeight ( 1 );
    fill ( 255 );
    rect ( this.ipos [ i ] .x , this.ipos [ i ] .y , this.size.x , this.size.y , this.size.y / 4 );
    fill ( this.con );
    noStroke ();
    if ( i != this.namei ) text ( this.names [ i ], this.iend [ i ] .x - 25 , this.imid [ i ] .y );
    stroke ( this.con );
  }
 } 
  line ( this.end.x - 15 * scand , this.mid.y , this.end.x - 10 * scand , this.mid.y + 5 * scand );
  line ( this.end.x - 5 * scand , this.mid.y , this.end.x - 10 * scand , this.mid.y + 5 * scand );
  fill ( this.con );
   noStroke ();
  text ( this.names [ this.namei ], this.end.x - 20 * scand , this.mid.y );
  stroke ( this.con );
 }



//drawing feature of adding rooms and deleting

if ( this.type == 11 || this.type == 13 ){
  stroke ( this.con );
  if ( this.isover ()) strokeWeight ( 2 * scand );
  else strokeWeight ( 1 * scand );
  fill ( this.con );
//  text ( this.namei , this.pos.x , this.pos.y - 15 );
 // rect ( this.pos.x , this.pos.y , this.size.x , this.size.y );
  let a = createVector ( this.pos.x +( this.size.x * .5 ), this.pos.y +( this.size.y * .5 ));
  let isize = createVector ( this.size.y , this.size.y );
  fill ( this.con );

  //drawing feature of adding rooms and deleting

  drawicon ( this.icon , a , isize );

  if ( this.state ) for ( let i = 0 ; i < this.ipos.length ; i ++){

    let extend={Be:"droom",Ba:"throom",Li:"ving",Ki:"tchen",Cl:"oset",Di:"ning",La:"undry",Ha:"ll"};
   textAlign ( CENTER , CENTER );
   let origString = this.names[i].split('');
   origString.splice(2, 0, extend[this.names[i]]);
   let newString = origString.join('');
   fill ( 255 );
   if ( this.isoveri ( i )) strokeWeight ( 2 );
   else strokeWeight ( 1 );
   if(this.type==13){
     rect ( this.ipos [ i ] .y+10 , this.ipos [ i ] .x , this.size.x+50 , this.size.y , this.size.y / 4 );
     fill ( this.con );
      noStroke ();
      text ( newString, this.imid [ i ] .y+35 , this.imid [ i ] .x );
      stroke ( this.con );
   }
   else{
      rect ( this.ipos [ i ] .x , this.ipos [ i ] .y+20 , this.size.x +50, this.size.y , this.size.y / 4 );
      fill ( this.con );
      noStroke ();
      text ( newString, this.imid [ i ] .x +25, this.imid [ i ] .y+20 );
      stroke ( this.con );
   }
   
 }
 }
 

//for entry column of the table
  if ( this.type == 12 ){

  stroke ( this.con );
  if ( this.isover ()) strokeWeight ( 2 * scand );
  else strokeWeight ( 1 * scand );
  fill ( 255 );
  textAlign ( CENTER , CENTER );
  noFill ();
  strokeWeight ( 1 );
  if ( this.state ){
   for ( let i = 0 ; i < this.ipos.length ; i ++){
    if ( this.isoveri ( i )) strokeWeight ( 2 );
    else strokeWeight ( 1 );
    fill ( 255 );
    rect ( this.ipos [ i ] .x , this.ipos [ i ] .y , this.size.x , this.size.y , this.size.y / 4 );
    fill ( this.con );
    noStroke ();
    if ( i != this.namei ) text ( this.names [ i ], this.imid [ i ] .x , this.imid [ i ] .y - 5 * scand );
  stroke ( this.con );
  }
 } 
  noStroke ();
  fill ( 228,226,226 );
  strokeWeight(2);
  stroke(200);
  rect ( this.pos.x , this.pos.y , this.size.x , this.size.y ,5 );
  stroke ( this.con );
  // line ( this.mid.x - 5 * scand , this.end.y - 9 * scand , this.mid.x - 0 * scand , this.end.y - 4 * scand );
  // line ( this.mid.x + 5 * scand , this.end.y - 9 * scand , this.mid.x - 0 * scand , this.end.y - 4 * scand );
  fill ( this.con );
  noStroke ();
  text ( this.names [ this.namei ], this.mid.x , this.mid.y - 5 * scand );
  
 }

  if ( this.type == 20 ){
  rectMode ( CORNER );
  textAlign ( CENTER , CENTER );
  for ( let i = 0 ; i < this.names.length ; i ++) if ( i != this.namei ){ 
   noFill ();
   stroke ( this.coff );
   strokeWeight ( 1 * scand );

   if ( this.isoveri ( i )) strokeWeight ( 1.5 * scand );
   rect ( this.ipos [ i ] .x , this.ipos [ i ] .y , this.size.x , this.size.y );
   fill ( this.coff );
   noStroke ();
   text ( this.names [ i ], this.imid [ i ] .x , this.imid [ i ] .y );
    stroke ( this.con );
 }
  for ( let i = 0 ; i < this.names.length ; i ++) if ( i == this.namei ){
   stroke ( this.con );
   strokeWeight ( 1.5 * scand );
   line ( this.ipos [ i ] .x , this.ipos [ i ] .y , this.ipos [ i ] .x , this.iend [ i ] .y );
   line ( this.ipos [ i ] .x , this.ipos [ i ] .y , this.iend [ i ] .x , this.ipos [ i ] .y );
   line ( this.iend [ i ] .x , this.ipos [ i ] .y , this.iend [ i ] .x , this.iend [ i ] .y );
   fill ( this.con );
   noStroke ();
   text ( this.names [ i ], this.imid [ i ] .x , this.imid [ i ] .y );
   stroke ( this.con );
 }
 }


  if ( this.type == 30 ){

  for ( let i = 0 ; i < this.names.length ; i ++) if ( i != this.namei ){ 
   fill ( this.coff );
   stroke ( this.coff );
   strokeWeight ( 1 * scand );
   if ( this.isoveri ( i )) strokeWeight ( 1.5 * scand );
   ellipse ( this.imid [ i ] .x , this.imid [ i ] .y , 7 * scand , 7 * scand );
 }
  for ( let i = 0 ; i < this.names.length ; i ++) if ( i == this.namei ){
   fill ( this.con );
   stroke ( this.con );
   strokeWeight ( 1 * scand );
   if ( this.isoveri ( i )) strokeWeight ( 1.5 * scand );
   ellipse ( this.imid [ i ] .x , this.imid [ i ] .y , 7 * scand , 7 * scand );
 }
 }

   if ( this.type == 31 ){
    noStroke ();
 // starsys ( this.pos , this.size , 0 , 200 , 100 );
  for ( let i = 0 ; i < this.names.length ; i ++) if ( i > this.namei ){ 
   fill ( this.coff );
   stroke ( this.coff );
   strokeWeight ( 1 * scand );
   if ( this.isoveri ( i )) strokeWeight ( 1.5 * scand );
   star5 ( this.ipos [ i ], createVector ( this.size.x * .8 , this.size.y * .8 ));
 }
  for ( let i = 0 ; i < this.names.length ; i ++) if ( i <= this.namei ){
   fill ( this.con );
   stroke ( this.con );
   strokeWeight ( 1 * scand );
   if ( this.isoveri ( i )) strokeWeight ( 1.5 * scand );
   star5 ( this.ipos [ i ], createVector ( this.size.x * .8 , this.size.y * .8 ));
 }
 }
  pop ();
 }



otherselectarr (   allsl ){
  let bout = false ;
  for ( let o = 0 ; o < allsl.length ; o ++) if ( allsl [ o ] .state ) bout = true ;
  if ( this.state ) bout = false ;
  return bout ;
 }


 // to manipulate hovering of plus button
  isover (){
  if ( mouseX > this.pos.x && mouseX < this.end.x+65 && mouseY > this.pos.y && mouseY < this.end.y ) return true ;
  else return false ;
 }



  isoveri ( nim ){

  let  bout  = new Array ( this.names.length );
  for ( let i = 0 ; i < bout.length ; i ++){
  if ( this.type == 13 ){  
    if ( mouseX > (this.ipos [ i ] .y+10) && mouseX < (this.ipos [ i ] .y+10+this.size.x+50) && mouseY > this.ipos [ i ] .x && mouseY < (this.ipos [ i ] .x+this.size.y) ) bout [ i ]= true ;
    else bout [ i ]= false ;
  }
  else if(this.type == 11){
    if ( mouseX > this.ipos [ i ] .x && mouseX < (this.ipos [ i ] .x+this.size.x+50) && mouseY > this.ipos [ i ] .y+20 && mouseY < (this.ipos [ i ] .y+this.size.y+20) ) bout [ i ]= true ; 
    else bout [ i ]= false ;
  }
  else{
    if ( mouseX > this.ipos [ i ] .x && mouseX < this.iend [ i ] .x && mouseY > this.ipos [ i ] .y && mouseY < this.iend [ i ] .y ) bout [ i ]= true ; 
    else bout [ i ]= false ;
  }
  
 }
  return bout [ nim ];
 }


  press (){
  if ( this.type == 10 || this.type == 11 || this.type == 12 || this.type == 13 ){
  if ( this.isover ()) this.state =! this.state ;
  if ( this.state ) for ( let i = 0 ; i < this.names.length ; i ++) if ( i != this.namei || this.type == 11 || this.type == 13 ){
   if ( this.isoveri ( i )){
    this.namei = i ;
    this.state =! this.state ;
  }
 }
  this.calcipos ( this.type );
 }
  if ( this.type == 20 || this.type == 30 || this.type == 31 ){
  for ( let i = 0 ; i < this.names.length ; i ++) if ( this.isoveri ( i )){
   this.namei = i ;
 }
 }
 }


pressoff (){
  if ( this.type == 11 ) this.namei =- 1 ; 
 }


}



function drawicon (  icon  ,  pos  ,  size ){
 if ( icon == 0 ){ 
  push ();
  rect ( pos.x - size.x * .35 , pos.y , size.x * .7 , size.y * .1 , size.y * .1 );
  translate ( pos.x - size.x * .3 , pos.y + size.y * .05 );
  rotate ( QUARTER_PI );
  translate (- pos.x + size.x * .3 ,- pos.y - size.y * .05 );
  rect ( pos.x - size.x * .3 , pos.y , size.x * .4 , size.y * .1 , size.y * .1 );
  translate ( pos.x - size.x * .3 , pos.y + size.y * .05 );
  rotate (- 2 * QUARTER_PI );
  translate (- pos.x + size.x * .3 ,- pos.y - size.y * .05 );
  rect ( pos.x - size.x * .3 , pos.y , size.x * .4 , size.y * .1 , size.y * .1 );
  pop ();
 }
 if ( icon == 1 ){// INFORMATION
  rectMode ( CENTER );
  ellipse ( pos.x , pos.y - size.y * .3 , size.y * .1 , size.y * .1 );
  rect ( pos.x , pos.y + size.y * .1 , size.x * .1 , size.y * .5 , size.y * .1 );
  rect ( pos.x - size.x * .1 , pos.y - size.y * .1 , size.x * .2 , size.y * .1 , size.y * .1 );
  rectMode ( CORNER );
 }
 if ( icon == 2 ){// PLUS

  rect ( pos.x - size.x * .4 , pos.y - size.y * .05 , size.x * .8 , size.y * .1 , size.y * .1 );
  rect ( pos.x - size.x * .05 , pos.y - size.y * .4 , size.x * .1 , size.y * .8 , size.y * .1 );
  noFill()
  // strokeWeight(1.5);
  // stroke(200);
  rect(pos.x-22,pos.y-17,size.x+70,size.y+5,15)
  textSize(18);
  // fill(255,6);
  text('Room', pos.x+15 ,pos.y+5); 
 }
 if ( icon == 3 ){// SAVED MOUSE
  push ();
  rect ( pos.x - size.x * .05 , pos.y - size.y * .3 , size.y * .1 , size.y * .4 , size.y * .1 );
  rect ( pos.x - size.x * .35 , pos.y + size.y * .2 , size.x * .7 , size.y * .1 , size.y * .1 );
  translate ( size.x * .3 ,- size.y * .4 );
  translate ( pos.x - size.x * .3 , pos.y + size.y * .05 );
  rotate ( HALF_PI );
  rotate ( QUARTER_PI );
  translate (- pos.x + size.x * .3 ,- pos.y - size.y * .05 );
  rect ( pos.x - size.x * .3 , pos.y , size.x * .4 , size.y * .1 , size.y * .1 );
  translate ( pos.x - size.x * .3 , pos.y + size.y * .05 );
  rotate (- 2 * QUARTER_PI );
  translate (- pos.x + size.x * .3 ,- pos.y - size.y * .05 );
  rect ( pos.x - size.x * .35 , pos.y , size.x * .4 , size.y * .1 , size.y * .1 );
  pop ();
 }
 if ( icon == 4 ){// HOME
  push ();
  rect ( pos.x - size.x * .3 , pos.y - size.y *+ .15 , size.y * .1 , size.y * .3 , size.y * .1 );
  rect ( pos.x + size.x * .18 , pos.y - size.y *+ .15 , size.y * .1 , size.y * .3 , size.y * .1 );
  rect ( pos.x - size.x * .35 , pos.y + size.y * .2 , size.x * .7 , size.y * .1 , size.y * .1 );
  translate ( size.x * .3 ,- size.y * .4 );
  translate ( pos.x - size.x * .3 , pos.y + size.y * .05 );
  rotate ( HALF_PI );
  rotate ( QUARTER_PI );
  translate (- pos.x + size.x * .3 ,- pos.y - size.y * .05 );
  rect ( pos.x - size.x * .3 , pos.y , size.x * .4 , size.y * .1 , size.y * .1 );
  translate ( pos.x - size.x * .3 , pos.y + size.y * .05 );
  rotate (- 2 * QUARTER_PI );
  translate (- pos.x + size.x * .3 ,- pos.y - size.y * .03 );
  rect ( pos.x - size.x * .3 , pos.y , size.x * .4 , size.y * .1 , size.y * .1 );
  pop ();
 }

 if ( icon == 5 ){// SAVE
  push ();
  rect ( pos.x - size.x * .05 , pos.y - size.y * .4 , size.y * .1 , size.y * .5 , size.y * .1 );
  rect ( pos.x - size.x * .35 , pos.y + size.y * .2 , size.x * .7 , size.y * .1 , size.y * .1 );
  translate ( size.x * .3 ,- size.y * .4 );
  translate ( pos.x - size.x * .3 , pos.y + size.y * .50 );
  rotate ( PI * 1.5 );
  rotate ( QUARTER_PI );
  translate (- pos.x + size.x * .3 ,- pos.y - size.y * .05 );
  rect ( pos.x - size.x * .3 , pos.y , size.x * .4 , size.y * .1 , size.y * .1 );
  translate ( pos.x - size.x * .3 , pos.y + size.y * .05 );
  rotate (- 2 * QUARTER_PI );
  translate (- pos.x + size.x * .3 ,- pos.y - size.y * .05 );
  rect ( pos.x - size.x * .3 , pos.y , size.x * .4 , size.y * .1 , size.y * .1 );
  pop ();
 }

 if ( icon == 6 ){// PENCIL
  push ();
  translate ( pos.x  , pos.y );
  rotate (- QUARTER_PI );
  translate (- pos.x ,- pos.y );
  rect ( pos.x - size.y * .15 , pos.y - size.y * .1 , size.x * .5 , size.y * .15 , size.y * .1 );
  rotate ( QUARTER_PI );
  pop ();
  triangle ( pos.x - size.x * .2 , pos.y + size.x * .15 , pos.x - size.x * .2 , pos.y + size.x * .2 , pos.x - size.x * .15 , pos.y + size.x * .2 );
 }
 if ( icon == 7 ){// DELETE HOMES
  push ();
  translate ( pos.x , pos.y );
  rotate (- QUARTER_PI );
  translate (- pos.x ,- pos.y );
  rect ( pos.x - size.x * .4 , pos.y - size.y * .05 , size.x * .8 , size.y * .1 , size.y * .1 );
  rect ( pos.x - size.x * .05 , pos.y - size.y * .4 , size.x * .1 , size.y * .8 , size.y * .1 );
  pop ();
 }
 if ( icon == 8 ){// BUY HOME
  push ();
  translate ( pos.x , pos.y );
  rotate (- QUARTER_PI );
  translate (- pos.x ,- pos.y );
  translate (- size.x * .1 , size.y * .1 );
  rect ( pos.x - size.y * .15 , pos.y - size.y * .05 , size.x * .6 , size.y * .15 , size.y * .1 );
  rect ( pos.x - size.y * .15 , pos.y - size.y * .3 , size.x * .15 , size.y * .4 , size.y * .1 );
  pop ();
 }

 if ( icon == 9 ){// MINUS
  rect ( pos.x - size.x * .4 , pos.y - size.y * .05 , size.x * .8 , size.y * .1 , size.y * .1 );
 // rect ( pos.x - size.x * .05 , pos.y - size.y * .4 , size.x * .1 , size.y * .8 , size.y * .1 );
 // strokeWeight(1.5);
  // stroke(200);
  noFill();
  rect(pos.x-22,pos.y-17,size.x+70,size.y+5,15)
  textSize(18);
  // fill(255,6);
  text('Room', pos.x+15 ,pos.y+5); 
 }
 if ( icon == 10 ){// MORE 3 PUNTOS
  ellipse ( pos.x - size.x * .3 , pos.y , size.y * .2 , size.y * .2 );
  ellipse ( pos.x , pos.y , size.y * .2 , size.y * .2 );
  ellipse ( pos.x + size.x * .3 , pos.y , size.y * .2 , size.y * .2 );
 }
 if ( icon == 11 ){// ACCOUNT
  rect ( pos.x - size.x * .35 , pos.y + size.y * .2 , size.x * .7 , size.y * .1 , size.y * .1 );
 }
 if ( icon == 12 ){// GENERATE
  push ();
  rect ( pos.x - size.x * .3 , pos.y - size.y *+ .15 , size.y * .1 , size.y * .3 , size.y * .1 );
  rect ( pos.x + size.x * .18 , pos.y - size.y *+ .15 , size.y * .1 , size.y * .3 , size.y * .1 );

  rect ( pos.x - size.x * .1 , pos.y + size.y * .2 , size.x * .3 , size.y * .1 , size.y * .1 );
  rect ( pos.x + size.x * .1 - size.x * .1 , pos.y + size.y * .1 , size.x * .1 , size.y * .3 , size.y * .1 );

  translate ( size.x * .3 ,- size.y * .4 );
  translate ( pos.x - size.x * .3 , pos.y + size.y * .05 );
  rotate ( HALF_PI );
  rotate ( QUARTER_PI );
  translate (- pos.x + size.x * .3 ,- pos.y - size.y * .05 );
  rect ( pos.x - size.x * .3 , pos.y , size.x * .4 , size.y * .1 , size.y * .1 );
  translate ( pos.x - size.x * .3 , pos.y + size.y * .05 );
  rotate (- 2 * QUARTER_PI );
  translate (- pos.x + size.x * .3 ,- pos.y - size.y * .03 );
  rect ( pos.x - size.x * .3 , pos.y , size.x * .4 , size.y * .1 , size.y * .1 );
  pop ();
 }
 if ( icon == 13 ){// MINUS
  rect ( pos.x - size.x * .2 , pos.y - size.y * .025 , size.x * .4 , size.y * .05 , size.y * .05 );
 // rect ( pos.x - size.x * .05 , pos.y - size.y * .4 , size.x * .1 , size.y * .8 , size.y * .1 );
 }

 if ( icon == 14 ){// PLUS
  rect ( pos.x - size.x * .2 , pos.y - size.y * .025 , size.x * .4 , size.y * .05 , size.y * .05 );
  rect ( pos.x - size.x * .025 , pos.y - size.y * .2 , size.x * .05 , size.y * .4 , size.y * .05 );
 }
 if ( icon == 15 ){// MINUS
  rect ( pos.x - size.x * .3 , pos.y - size.y * .2 , size.x * .6 , size.y * .06 , size.y * .03 );
  rect ( pos.x - size.x * .3 , pos.y - size.y * .0 , size.x * .6 , size.y * .06 , size.y * .03 );
  rect ( pos.x - size.x * .3 , pos.y + size.y * .2 , size.x * .6 , size.y * .06 , size.y * .03 );
 // rect ( pos.x - size.x * .05 , pos.y - size.y * .4 , size.x * .1 , size.y * .8 , size.y * .1 );
 }
  if ( icon == 16 ){// LOCK OPEN
  rect ( pos.x - size.x * .25 , pos.y - size.y * .1 , size.x * .5 , size.y * .1 , size.y * .05 );
  rect ( pos.x - size.x * .25 , pos.y + size.y * .2 , size.x * .5 , size.y * .1 , size.y * .05 );
  rect ( pos.x - size.x * .25 , pos.y - size.y * .3 , size.x * .5 , size.y * .1 , size.y * .05 );
  rect ( pos.x - size.x * .25 , pos.y - size.y * .3 , size.y * .1 , size.x * .55 , size.y * .05 );
  rect ( pos.x + size.x * .25 - size.x * .1 , pos.y - size.y * .1 , size.x * .1 , size.x * .35 , size.y * .05 );
  rect ( pos.x - size.x * .05 , pos.y + size.y * .02 , size.x * .1 , size.y * .15 , size.y * .05 );
 }

 if ( icon == 17 ){// LOCK CLOSE
  rect ( pos.x - size.x * .25 , pos.y - size.y * .1 , size.x * .5 , size.y * .1 , size.y * .05 );
  rect ( pos.x - size.x * .25 , pos.y + size.y * .2 , size.x * .5 , size.y * .1 , size.y * .05 );
  rect ( pos.x - size.x * .25 , pos.y - size.y * .3 , size.x * .5 , size.y * .1 , size.y * .05 );
  rect ( pos.x - size.x * .25 , pos.y - size.y * .3 , size.y * .1 , size.x * .55 , size.y * .05 );
  rect ( pos.x + size.x * .25 - size.x * .1 , pos.y - size.y * .3 , size.y * .1 , size.x * .55 , size.y * .05 );
  rect ( pos.x - size.x * .05 , pos.y + size.y * .02 , size.x * .1 , size.y * .15 , size.y * .05 );
 }
}
function star5 (  pos  ,  size ){
 let mid = createVector ( pos.x + size.x * .5 , pos.y + size.y * .5 );
 let angle = TWO_PI / 5 ;
 let halfAngle = angle / 2.0 ;
 beginShape ();
 for ( let a = 0 ; a < TWO_PI ; a += angle ){
  let sx = mid.x + cos ( a )* size.x * .5 ;
  let sy = mid.y + sin ( a )* size.x * .5 ;
  vertex ( sx , sy );
  sx = mid.x + cos ( a + halfAngle )* size.x * .25 ;
  sy = mid.y + sin ( a + halfAngle )* size.x * .25 ;
  vertex ( sx , sy );
 }
 endShape ( CLOSE );
}
function starsys (  pos  ,  size  ,  calif  ,  coff  ,  con ){
 for ( let i = 0 ; i < 5 ; i ++){
  if ( i < calif ) fill ( con );
  else fill ( coff );
  star5 ( createVector ( pos.x +(( size.x / 5 )* i ), pos.y ), createVector ( size.y , size.y )); 
 }
}


class Slider {
 constructor (  _pos  ,  _size  ,  _name  ,  _type  ,  _minV  ,  _value  ,  _maxV ){
  this.pos , this.size , this.mid , this.end , this.bupos , this.bupos2 , this.busize , this.slsize , this.slstopb , this.slstope , this.clpos , this.clsize ;
  this.name ;
  this.value , this.value2 , this.minstopv , this.maxstopv ;
  this.state , this.drag , this.drag2 ;
  this.minV = 0 ;
  this.maxV = 1 ;
  this.flt = 1 ;
  this.type = 0 ;
  this.icon = 0 ;
  this.textsize = 12 ;
  this.textdist = 90 ;
  scand = 1 ;
  this.con = 100 ;
  this.coff = 200 ;
  this.pos = _pos ;
  this.size = _size ;
  this.name = _name ;
  this.type = _type ;
  this.minV = _minV ;
  this.value = _value ;
  this.value2 = this.value ;
  this.maxV = _maxV ;
  this.calcpos ();
  this.nostops ();
 }
  calcpos (){
  this.mid = createVector ( this.pos.x + this.size.x * .5 , this.pos.y + this.size.y * .5 );
  this.end = createVector ( this.pos.x + this.size.x , this.pos.y + this.size.y );
  this.bupos = createVector ( map ( this.value , this.minV , this.maxV , this.pos.x , this.end.x ), this.mid.y );
  this.bupos2 = createVector ( map ( this.value2 , this.minV , this.maxV , this.pos.x , this.end.x ), this.mid.y );
  this.busize = createVector ( this.size.y , this.size.y );
  this.slsize = createVector ( this.size.x , 3 * scand );
  this.clpos = createVector ( this.pos.x - this.busize.x , this.pos.y );
  this.clsize = createVector ( this.busize.x , this.busize.y * 2 );
  if ( this.type == 11 ){
  this.bupos = createVector ( this.mid.x , map ( this.value , this.minV , this.maxV , this.pos.y , this.end.y ));
  this.bupos2 = createVector ( this.mid.x , map ( this.value2 , this.minV , this.maxV , this.pos.y , this.end.y ));
  this.busize = createVector ( this.size.x , this.size.x );
  this.slsize = createVector ( 3 * scand , this.size.y );
  this.clpos = createVector ( this.pos.x - this.busize.y * .5 , this.pos.y - this.busize.y );
  this.clsize = createVector ( this.busize.x * 2 , this.busize.y );
 }
 }
  nostops (){
  this.slstopb = createVector ( this.pos.x , this.pos.y );
  this.slstope = createVector ( this.end.x , this.end.y );
 }
  scaletoandroid (  _scand ){
  scand = _scand ;
  this.pos = createVector ( scand * this.pos.x , scand * this.pos.y );
  this.size = createVector ( scand * this.size.x , scand * this.size.y );
  this.calcpos ();
  this.slstopb = createVector ( scand * this.slstopb.x , scand * this.slstopb.y );
  this.slstope = createVector ( scand * this.slstope.x , scand * this.slstope.y );
  this.textsize = this.textsize * scand ;
 }
  addstops (  _minstopV  ,  _maxstopV ){
  this.minstopv = _minstopV ;
  this.maxstopv = _maxstopV ;
  this.slstopb = createVector ( map ( this.minstopv , this.minV , this.maxV , this.pos.x , this.end.x ), map ( this.minstopv , this.minV , this.maxV , this.pos.y , this.end.y ));
  this.slstope = createVector ( map ( this.maxstopv , this.minV , this.maxV , this.pos.x , this.end.x ), map ( this.maxstopv , this.minV , this.maxV , this.pos.y , this.end.y ));
 }
  addsecond (  _value2 ){
  this.value2 = _value2 ;
  this.calcpos ();
 }
  display (){
  push ();
  rectMode ( CORNER );
  textSize ( this.textsize );


  if ( this.type == 10 ){          // Simple horizontal 
  this.value = this.rg ( map ( this.bupos.x , this.pos.x , this.end.x , this.minV , this.maxV ), this.flt ); 
  if ( this.drag ) this.bupos.x = constrain ( mouseX , this.slstopb.x , this.slstope.x );
  print ( this.pos.x );
  if ( this.slstopb != null ) if ( this.slstopb.x != this.pos.x ) line ( this.slstopb.x , this.mid.y -( this.busize.y * .2 ), this.slstopb.x , this.mid.y +( this.busize.y * .2 ));
  if ( this.slstope != null ) if ( this.slstope.x != this.end.x ) line ( this.slstope.x , this.mid.y -( this.busize.y * .2 ), this.slstope.x , this.mid.y +( this.busize.y * .2 ));
  noStroke ();
  fill ( this.coff );
  rect ( this.pos.x , this.mid.y - this.slsize.y * .5 , this.slsize.x , this.slsize.y , this.slsize.y * .5 ); 
  fill ( this.con );
  rect ( this.pos.x , this.mid.y - this.slsize.y * .5 , this.bupos.x - this.pos.x , this.slsize.y , this.slsize.y / 2 ); 
  strokeWeight ( 1 * scand );
  if ( this.isover ()) strokeWeight ( 2 * scand );
  stroke ( this.con );
  fill ( 255 );
  ellipse ( this.bupos.x , this.mid.y , this.busize.x , this.busize.y );
  fill ( this.con );
  noStroke ();
  textAlign ( CENTER , CENTER );
  if ( this.flt > 1 ) text ( int ( this.value ), this.bupos.x , this.bupos.y - this.busize.y * .5 - this.textsize * .8 );
  else text ( nfc ( this.value , 2 ), this.bupos.x , this.bupos.y - this.busize.y * .5 - this.textsize * .8 ); 
  fill ( this.con );
  textAlign ( LEFT , CENTER );
  noStroke ();
  text ( this.name , this.pos.x - this.textdist , this.mid.y );
  strokeWeight ( 1 * scand );
 } 



  if ( this.type == 11 ){          // Simple vertical sin nombre

    fill ( 228,226,226 );
    strokeWeight(4);
    // stroke(51);
    
  this.value = this.rg ( map ( this.bupos.y , this.pos.y , this.end.y , this.minV , this.maxV ), this.flt ); 
  if ( this.drag ) this.bupos.y = constrain ( mouseY , this.slstopb.y , this.slstope.y );
  fill ( 228,226,226 );
  stroke ( this.coff );
  rect ( this.clpos.x , this.clpos.y , this.clsize.x ,this.busize.y );

  if ( this.state ){
   rect ( this.clpos.x , this.clpos.y , this.clsize.x , this.size.y + this.clsize.y , this.busize.y / 4 );
   if ( this.slstopb != null ) if ( this.slstopb.y != this.pos.y ) line ( this.mid.x - this.busize.x * .2 , this.slstopb.y , this.mid.x + this.busize.x * .2 , this.slstopb.y );
   if ( this.slstope != null ) if ( this.slstope.y != this.end.y ) line ( this.mid.x - this.busize.x * .2 , this.slstope.y , this.mid.x + this.busize.x * .2 , this.slstope.y );
   noStroke ();
   fill ( this.coff );
   rect ( this.mid.x - this.slsize.x * .5 , this.pos.y , this.slsize.x , this.slsize.y , this.slsize.x * .5 ); 
   fill ( this.con );
   rect ( this.mid.x - this.slsize.x * .5 , this.pos.y , this.slsize.x , this.bupos.y - this.pos.y , this.slsize.x / 2 ); 
   strokeWeight ( 1 * scand );
   if ( this.isover ()) strokeWeight ( 2 * scand );
   stroke ( this.con );
   fill ( 255 );
   ellipse ( this.bupos.x , this.bupos.y , this.busize.x , this.busize.y );
   stroke ( this.coff );
 }
  strokeWeight ( 1 * scand );
  if ( this.isovercl ()) strokeWeight ( 2 * scand );
  if (! this.state ){
   noStroke ();
   rect ( this.clpos.x , this.clpos.y , this.busize.x * 2 , this.busize.y , this.busize.y / 4 );
   stroke ( this.con );
  //  line ( this.clpos.x + this.busize.x , this.clpos.y + this.busize.y - scand * 5 , this.clpos.x + this.busize.x - scand * 5 , this.clpos.y + this.busize.y - scand * 10 );
  //  line ( this.clpos.x + this.busize.x , this.clpos.y + this.busize.y - scand * 5 , this.clpos.x + this.busize.x + scand * 5 , this.clpos.y + this.busize.y - scand * 10 );
 }
  if ( this.state ){
   line ( this.clpos.x + this.busize.x , this.clpos.y + this.busize.y - scand * 10 , this.clpos.x + this.busize.x - scand * 5 , this.clpos.y + this.busize.y - scand * 5 );
   line ( this.clpos.x + this.busize.x , this.clpos.y + this.busize.y - scand * 10 , this.clpos.x + this.busize.x + scand * 5 , this.clpos.y + this.busize.y - scand * 5 );
 }
  fill ( this.con );
  textAlign ( CENTER , CENTER );
noStroke ();
  if ( this.flt >= 1 ) text ( int ( this.value ), this.mid.x , this.pos.y - this.busize.y * .7 );
  else text ( nfc ( this.value , 2 ), this.mid.x , this.pos.y - this.busize.y * .7 ); 
  fill ( this.con );
  textAlign ( CENTER , CENTER );
 // text ( this.name , this.mid.x , this.pos.y - this.textsize * 2 );
  strokeWeight ( 1 * scand );
 } 



 

  if ( this.type == 20 ){      // Doble horizontal
  this.value = this.rg ( map ( this.bupos.x , this.pos.x , this.end.x , this.minV , this.maxV ), this.flt );
  this.value2 = this.rg ( map ( this.bupos2.x , this.pos.x , this.end.x , this.minV , this.maxV ), this.flt );

  if ( this.drag ) this.bupos.x = constrain ( mouseX , this.slstopb.x , this.bupos2.x - this.busize.y );
  if ( this.drag2 ) this.bupos2.x = constrain ( mouseX , this.bupos.x + this.busize.y , this.slstope.x );
  if ( this.slstopb != null ) if ( this.slstopb.x != this.pos.x ) line ( this.slstopb.x , this.slstopb.y -( this.busize.y * .2 ), this.slstopb.x , this.slstopb.y + this.slsize.y +( this.busize.y * .2 ));
  if ( this.slstope != null ) if ( this.slstope.x != this.end.x ) line ( this.slstope.x , this.slstope.y - this.slsize.y -( this.busize.y * .2 ), this.slstope.x , this.slstope.y +( this.busize.y * .2 ));
  noStroke ();
  fill ( this.coff );
  rect ( this.pos.x , this.mid.y - this.slsize.y * .5 , this.slsize.x , this.slsize.y , this.slsize.y * .5 ); 
  fill ( this.con );
  rect ( this.bupos.x , this.mid.y - this.slsize.y * .5 , this.bupos2.x - this.bupos.x , this.slsize.y , this.slsize.y / 2 ); 
  strokeWeight ( 1 * scand );
  stroke ( this.con );
  fill ( 255 );
  if ( this.isover ()) strokeWeight ( 2 * scand );
  else strokeWeight ( 1 * scand );
  ellipse ( this.bupos.x , this.mid.y , this.busize.x , this.busize.y );
  if ( this.isover2 ()) strokeWeight ( 2 * scand );
  else strokeWeight ( 1 * scand );
  ellipse ( this.bupos2.x , this.mid.y , this.busize.x , this.busize.y );
  fill ( this.con );
  textAlign ( CENTER , CENTER );
  noStroke ();
  if ( this.flt > 1 ) text ( int ( this.value ), this.bupos.x , this.pos.y - this.busize.y * .5 - this.textsize * .8 );
  else text ( nfc ( this.value , 2 ), this.bupos.x , this.pos.y - this.busize.y * .5 - this.textsize * .8 ); 
  if ( this.flt > 1 ) text ( int ( this.value2 ), this.bupos2.x , this.pos.y - this.busize.y * .5 - this.textsize * .8 );
  else text ( nfc ( this.value2 , 2 ), this.bupos2.x , this.pos.y - this.busize.y * .5 - this.textsize * .8 ); 
  fill ( this.con );
  textAlign ( LEFT , CENTER );
  noStroke ();
  text ( this.name , this.pos.x - this.textdist , this.mid.y );
  strokeWeight ( 1 * scand );
 }
  pop ();
 }
  isover (){
  return ( mouseX > this.bupos.x - this.busize.x * .5 && mouseX < this.bupos.x + this.busize.x * .5 && mouseY > this.bupos.y - this.busize.y * .5 && mouseY < this.bupos.y + this.busize.y * .5 );
 }
  isover2 (){
  return ( mouseX > this.bupos2.x - this.busize.x * .5 && mouseX < this.bupos2.x + this.busize.x * .5 && mouseY > this.bupos.y - this.busize.y * .5 && mouseY < this.bupos.y + this.busize.y * .5 );
 }
  isovercl (){
  return ( mouseX > this.clpos.x && mouseX < this.clpos.x + this.clsize.x && mouseY > this.clpos.y && mouseY < this.clpos.y + this.clsize.y );
 }
  otherselectlist (  allsl ){
  let bout = false ;
  for ( let i = 0 ; i < allsl.length ; i ++) if ( allsl [  i ] .state ) bout = true ;
  if ( this.state ) bout = false ;
 ;
  return bout ;
 }
  otherselectarr (   allsl ){
  let bout = false ;
  for ( let i = 0 ; i < allsl.length ; i ++) if ( allsl [ i ] .state ) bout = true ;
  if ( this.state ) bout = false ;
 ;
  return bout ;
 } 
  press (){
  if ( this.type == 11 ){
  if ( this.isovercl ()) this.state =! this.state ;
  if ( this.state ){
   if ( this.isover ()) this.drag = true ;
   if ( this.isover2 ()) this.drag2 = true ;
 }
 }
  if ( this.type != 11 ){
  if ( this.isover ()) this.drag = true ;
  if ( this.isover2 ()) this.drag2 = true ;
 }
 }
  release (){
  this.drag = false ;
  this.drag2 = false ;
 }
  roundit (  numin  ,  dec ){               
  let dec10 = pow ( 10 , dec );
  let roundout = round ( numin * dec10 )/ dec10 ;
  return roundout ;
 }
  rg (  fin  ,  grunit ){
  let fout = fin + grunit * .5 ;
  fout = this.roundit ( fout -( fout % grunit ), 2 );
  return fout ;
 }
}
class Textin {
 constructor (  _pos  ,  _size  ,  _name  ,  _type ){
  this.pos , this.size , this.mid , this.end ;
  this.name ;
  this.state ;
  this.itext = "" ;
  this.dash = " | " ;
  this.type = 0 ;
  this.icon = 0 ;
  this.textsize = 12 ;
  scand = 1 ;
  this.con = 200 ;
  this.coff = 100 ;
  this.pos = _pos ;
  this.size = _size ;
  this.calcpos ();
  this.name = _name ;
  this.type = _type ;
 }
  scaletoandroid (  _scand ){
  scand = _scand ;
  this.pos = createVector ( this.pos.x * scand , this.pos.y * scand );
  this.size = createVector ( this.size.x * scand , this.size.y * scand );
  this.calcpos ();
  this.textsize = this.textsize * scand ;
 }
  calcpos (){
  this.mid = createVector ( this.pos.x + this.size.x * .5 , this.pos.y + this.size.y * .5 );
  this.end = createVector ( this.pos.x + this.size.x , this.pos.y + this.size.y );
 }
  display (){
   textSize ( this.textsize );
  rectMode ( CORNER );
  textAlign ( CENTER , CENTER );
  fill ( this.coff );
  stroke ( this.con );
  strokeWeight ( 1 * scand );
//  rect ( this.pos.x , this.pos.y , this.size.x , this.size.y );
  if ( this.isover ()|| this.state ) fill ( this.con );
  if ( this.isover ()|| this.state ) stroke ( this.con );
  if ( this.isover ()|| this.state ) strokeWeight ( 2 * scand );
  line ( this.pos.x , this.pos.y + this.size.y , this.pos.x + this.size.x , this.pos.y + this.size.y );
  noStroke ();
  if ( this.itext.length== 0 &&! this.state ) text ( this.name , this.mid.x , this.mid.y - this.textsize * .3 );
  if ( this.type == 10 && this.itext.length< 50 ){
  if ( this.state ) text ( this.itext + this.dash , this.mid.x , this.mid.y - this.textsize * .3 );
  else text ( this.itext , this.mid.x , this.mid.y - this.textsize * .3 );
 }
  if ( this.type == 20 && this.itext.length< 50 ){
  let textp = "" ;
  for ( let i = 0 ; i < this.itext.length; i ++) textp = textp + " * " ;
  noStroke ();
  if ( this.state ) text ( textp + this.dash , this.mid.x , this.mid.y - this.textsize * .3 );
  else text ( textp , this.mid.x , this.mid.y - this.textsize * .3 );
 }
  
 }
   isover (){
  if ( mouseX > this.pos.x && mouseX < this.end.x && mouseY > this.pos.y && mouseY < this.end.y ) return true ;
  else return false ;
 }
   presson (){
  if ( this.isover ()) this.state =! this.state ;
 }
  pressoff (){
  if ( this.state ) if (! this.isover ()) this.state = false ;
 }
   type (){
  if ( this.state ){
  if (( key >= 'A' && key <= 'z' )||( key >= '0' && key <= '9' )|| key == ' ' || key == ' ( ' || key == ' ) ' || key == ' , ' || key == '.' || key == ' | ' || key == '@' || key == ' - ' || key == '_' ) this.itext = this.itext + str ( key );
  if (( key == CODED && keyCode == LEFT )|| keyCode == BACKSPACE ) if ( this.itext.length> 0 ) this.itext = this.itext.substring ( 0 , this.itext.length- 1 );
 }
 }
}
function textisar (   alltx ){
 let bout = false ;
 for ( let a = 0 ; a < alltx.length ; a ++) if ( alltx [ a ]!= null ) if ( alltx [ a ] .state ) bout = true ;
 return bout ;
}
function textis (  alltx ){
 let bout = false ;
 for ( let a = 0 ; a < alltx.length ; a ++) if ( alltx [  a ]!= null ) if ( alltx [  a ] .state ) bout = true ;
 return bout ;
}
class Textrect {
 constructor (  _pos  ,  _size  ,  _text  ,  _i ){
  this.pos , this.size ;
  this.textinit ;
  scand = 1 ;
  this.textsize = 12 ;
  this.i ;
  this.pos = _pos ;
  this.size = _size ;
  this.textinit = _text ;
  this.i = _i ;
 }
  scaletoandroid (  _scand ){
  scand = _scand ;
  this.pos = this.pos.copy () .mult ( scand );
  this.size = this.size.copy () .mult ( scand );
  this.textsize = this.textsize * scand ;
 }


  display (){
  push ();
  textSize ( this.textsize );
  fill ( 255 );
  textAlign ( CENTER , CENTER );
  // fill ( 228,226,226 );
  strokeWeight(10);
  stroke(200);
 rect ( this.pos.x , this.pos.y , this.size.x , this.size.y,10 );
  fill ( 100 );
  noStroke ();
  if ( this.textinit != null ) text ( this.textinit , this.pos.x + this.size.x * .5 , this.pos.y + this.size.y * .5 );
  pop ();
 }

}


let sl ;
let en ;
let tx , tti ;
let lk ;
let dr ;
let evo ;
let addrooms ;
let uipos ;
let uisize ;
let slcolumns =[[ 2 , 3 , 4 ],[ 5 , 6 , 7 ]];//[ 0 - 1 ] : 0:area 1:width [ 0 - 2 ] 0:ideal 1:min 2:max 
let frcount = 0 ;
let frcoutstop = 10 ;
let frcountrun = false ;
function recalctree (){
 setuptr ();
 setupid ();
 setupdraw ();
 setupga ();
}
function recalchouse (){
 changeroomDATA ();
 setupid ();
 setupdraw ();
}
function reinserthouse (){
 roomDATA = getroomDATA ( rooms , roomDATAIN );
 lockgenes = getroomLOCKS ( rooms , lockIN );
 setupsl ( rooms , roomDATA );
 setupho ();
 setuptr ();
 setupid ();
 setupdraw ();
 setupga ();
}
function evolveon (){
 setupga ();
 evolve = true ;
}
function evolveoff (){
 if ( frameCount % 90 == 0 ) evolve = false ;
}

//setting up the table

function setupsl (   rooms  ,   roomDATA ){
 uipos = createVector ( 50 , 10 );
  uisize = createVector ( 70 , 30 );
 let ttis =[ "" , "Area" , "Width" , "Entry" ];
 tti  = new Array ( ttis.length );
 for ( let i = 0 ; i < tti.length ; i ++) tti [ i ]= new Textrect ( createVector ( uipos.x + i * uisize.x , uipos.y+100 ), uisize , ttis [ i ], 10 );
 for ( let i = 0 ; i < tti.length ; i ++) tti [ i ] .scaletoandroid ( scand );
 lk  = new Array ( rooms.length ); 
 for ( let l = 0 ; l < lk.length ; l ++) lk [ l ]= new Toggle ( createVector ( uipos.x - uisize.x * .5 , uipos.y + l * uisize.y + uisize.y ), createVector ( uisize.y , uisize.y ), "candado" + l , 50 );
 for ( let l = 0 ; l < lk.length ; l ++) lk [ l ] .scaletoandroid ( scand );
 tx  = new Array ( rooms.length );
 for ( let i = 0 ; i < tx.length ; i ++) tx [ i ]= new Textrect ( createVector ( uipos.x , uipos.y + uisize.y + uisize.y * i +100), createVector ( uisize.x , uisize.y ), roomideals ( rooms [ i ], 1 , roomDATA ), 10 );
 for ( let i = 0 ; i < tx.length ; i ++) tx [ i ] .scaletoandroid ( scand );
 sl  = new Array ( 2 );
 for ( let s = 0 ; s < sl.length ; s ++) sl [ s ] = new Array ( rooms.length );
 for ( let s = 0 ; s < sl.length ; s ++) for ( let i = 0 ; i < sl [ s ] .length ; i ++) sl [ s ][ i ]= new Slider ( createVector ( uipos.x + s * uisize.x + uisize.x * 1.25 , uipos.y + uisize.y * 2.1 + uisize.y * i+100 ), createVector ( uisize.x * .45 , 200 ), roomideals ( rooms [ i ], 0 , roomDATA ), 11 , 0 , float ( roomideals ( rooms [ i ], slcolumns [ s ][ 0 ], roomDATA )), min0max1roomDATA ( slcolumns [ s ][ 2 ], roomDATA , 1 ));
 for ( let s = 0 ; s < sl.length ; s ++) for ( let i = 0 ; i < sl [ s ] .length ; i ++) sl [ s ][ i ] .flt = .8 ;
 for ( let s = 0 ; s < sl.length ; s ++) for ( let i = 0 ; i < sl [ s ] .length ; i ++) sl [ s ][ i ] .addstops ( float ( roomideals ( rooms [ i ], slcolumns [ s ][ 1 ], roomDATA )), float ( roomideals ( rooms [ i ], slcolumns [ s ][ 2 ], roomDATA )) );
 for ( let s = 0 ; s < sl.length ; s ++) for ( let i = 0 ; i < sl [ s ] .length ; i ++) sl [ s ][ i ] .scaletoandroid ( scand );
 en  = new Array ( rooms.length );
 for ( let l = 0 ; l < en.length ; l ++) en [ l ]= new Option ( createVector ( uipos.x + 2 * uisize.x + uisize.x , uipos.y + l * uisize.y + uisize.y +3 +100), createVector ( uisize.x * 1 , uisize.y ), roomsSINroom ( rooms , l ), 12 ); 
 for ( let l = 0 ; l < en.length ; l ++) en [ l ] .namei = roomidealadj ( rooms , rooms [ l ], roomDATA , 9 );// buscar room seleccionado
 for ( let l = 0 ; l < en.length ; l ++) en [ l ] .calcpos ();
 for ( let l = 0 ; l < en.length ; l ++) en [ l ] .scaletoandroid ( scand ); 
 addrooms  = new Array ( 2 );
 addrooms [ 0 ]= new Option ( createVector ( 50 , height / scand - 570 ), createVector ( 30 , 30 ), roomcodedeDATAIN ( roomDATAIN ), 13 );
 addrooms [ 1 ]= new Option ( createVector ( 210 , height / scand - 570 ), createVector ( 30 , 30 ), rooms , 11 );
 addrooms [ 0 ] .icon = 2 ;
 addrooms [ 1 ] .icon = 9 ;
 for ( let l = 0 ; l < addrooms.length ; l ++) addrooms [ l ] .con = 150 ;
 for ( let l = 0 ; l < addrooms.length ; l ++) addrooms [ l ] .scaletoandroid ( scand );
 evo = new Click ( createVector ( width * .5 / scand - uisize.x+155 , height / scand - uisize.y * 1.5 ), createVector ( uisize.x+30 , uisize.y ), "Generate Plan" , 20 );
 evo.scaletoandroid ( scand );
 dr = new Toggle ( createVector ( width / scand - uisize.x , height / scand - uisize.y * 2-500 ), createVector ( uisize.y , uisize.y ), "draw plot boundary" , 20 );
 dr.icon = 6 ;
 dr.scaletoandroid ( scand );
}
function drawsl (){
 for ( let i = 0 ; i < tti.length ; i ++) tti [ i ] .display ();
//  for ( let l = 0 ; l < lk.length ; l ++) lk [ l ] .display ();
 for ( let i = 0 ; i < tx.length ; i ++) tx [ i ] .display ();
 for ( let s = 0 ; s < sl.length ; s ++) for ( let i = 0 ; i < sl [ s ] .length ; i ++) sl [ s ][ i ] .display ();
 for ( let s = 0 ; s < sl.length ; s ++) for ( let i = 0 ; i < sl [ s ] .length ; i ++) if (! sl [ s ][ i ] .otherselectarr ( sl [ s ])) sl [ s ][ i ] .display ();
 for ( let s = 0 ; s < sl.length ; s ++) for ( let i = 0 ; i < sl [ s ] .length ; i ++) if ( sl [ s ][ i ] .drag ) recalchouse ();// changeroomDATA ();
 for ( let i = 0 ; i < en.length ; i ++) en [ i ] .display ();
 for ( let i = 0 ; i < en.length ; i ++) if (! en [ i ] .otherselectarr ( en )) en [ i ] .display ();
 for ( let a = 0 ; a < addrooms.length ; a ++) addrooms [ a ] .display ();
 evo.display ();
 evolveoff ();
 dr.display ();
 // for ( let s = 0 ; s < roomDATA.length ; s ++) for ( let i = 0 ; i < roomDATA [ s ] .length ; i ++) text ( roomDATA [ s ][ i ], 300 + i * 20 , 30 + s * 20 );
}
function presssl (){
 for ( let s = 0 ; s < sl.length ; s ++) for ( let i = 0 ; i < sl [ s ] .length ; i ++) if (! sl [ s ][ i ] .otherselectarr ( sl [ s ])) sl [ s ][ i ] .press ();     // slider press
 for ( let i = en.length - 1 ; i >= 0 ; i --) if (! en [ i ] .otherselectarr ( en )) en [ i ] .press ();
 for ( let i = en.length - 1 ; i >= 0 ; i --) if (! en [ i ] .state ) for ( let j = 0 ; j < en [ i ] .names.length ; j ++) if ( en [ i ] .isoveri ( j )) recalchouse ();
 for ( let l = 0 ; l < lk.length ; l ++) lk [ l ] .press ();
 for ( let l = 0 ; l < lk.length ; l ++) if ( lk [ l ] .isover ()) lockpress ( rooms ); 
 evo.presson ();
 if ( evo.state ) evolveon ();
 evo.pressoff ();
 dr.press ();
}
function lockpress (   rooms ){
 let onelockselect = false ;
 for ( let l = 0 ; l < lk.length ; l ++) if ( lk [ l ] .state ) onelockselect = true ; 
 let pmin = getngnum ( "pmin" , rooms.length );
 let pmax = getngnum ( "pmax" , rooms.length );
 let lmin = getngnum ( "lmin" , rooms.length );
 let lmax = getngnum ( "lmax" , rooms.length );
 let smin = getngnum ( "smin" , rooms.length );
 let smax = getngnum ( "smax" , rooms.length );
 if (! onelockselect ) for ( let i = pmin ; i < pmax ; i ++) lockgenes [ i ]= 0 ;// genes permutation a 0
 if (! onelockselect ) for ( let i = lmin ; i < lmax ; i ++) lockgenes [ i ]= 0 ;// genes locationtree a 0   // seguro si se pudieran cambiar a unos?????
 if ( onelockselect ) for ( let i = pmin ; i < pmax ; i ++) lockgenes [ i ]= 1 ;// genes permutation a 1
 if ( onelockselect ) for ( let i = lmin ; i < lmax ; i ++) lockgenes [ i ]= 1 ;// genes locationtree a 1
 for ( let i = smin ; i < smax ; i ++) lockgenes [ i ]= 0 ;       // todos los genes se hacen 0
 for ( let l = 0 ; l < lk.length ; l ++) if ( lk [ l ] .state ){
  for ( let n = 0 ; n < ho.no.length ; n ++) if ( txequal ( ho.no [  n ] .code , rooms [ l ])){
  for ( let i = smin ; i < smax ; i ++){
   if ( ho.ng [ i ] .loc.length< ho.no [  n ] .loc.length) if ( txequal ( ho.ng [ i ] .loc , ho.no [  n ] .loc.substring ( 0 , ho.ng [ i ] .loc.length) )) lockgenes [ i ]= 1 ;
 }
 }
 }
 recalctree ();
}
function pressadddrooms (){
 for ( let a = 0 ; a < addrooms.length ; a ++) addrooms [ a ] .press (); 
 for ( let a = 0 ; a < addrooms.length ; a ++) if ( addrooms [ a ] .namei !=- 1 ){
  if ( addrooms [ 0 ] .namei !=- 1 ) rooms = addtostarr ( rooms , roomDATAIN [ addrooms [ 0 ] .namei ][ 0 ]);
  if ( addrooms [ 1 ] .namei !=- 1 ) rooms = subtostarr ( rooms , rooms [ addrooms [ 1 ] .namei ]);
  reinserthouse ();
 }
 for ( let a = 0 ; a < addrooms.length ; a ++) addrooms [ a ] .pressoff ();
}
function releasesl (){
 for ( let s = 0 ; s < sl.length ; s ++) for ( let i = 0 ; i < sl [ s ] .length ; i ++) if (! sl [ s ][ i ] .otherselectarr ( sl [ s ])) sl [ s ][ i ] .release ();
}
function changeroomDATA (){
 for ( let s = 0 ; s < sl.length ; s ++) for ( let i = 0 ; i < sl [ s ] .length ; i ++) roomDATA [ i ][ slcolumns [ s ][ 0 ]]= sl [ s ][ i ] .value + "" ;
 for ( let i = 0 ; i < en.length ; i ++) roomDATA [ i ][ 9 ]= en [ i ] .names [ en [ i ] .namei ];
 // grscaleDEhouse ( ho );
}
let grpos , grsize , usmouse , grmouse ;
let grscale , grunit ;

//setting the grid 
function setupgr (){
 grpos = createVector ( width * .5 + 25 * scand-85 , 40 * scand );
 grsize = createVector (( width * .5 )-( 50 * scand ),( height )-( 105 * scand ));
 grscale = 20 * scand ;
 grunit = .8 ;
}
function drawgr (){
 rectMode ( CORNER );
 strokeWeight ( 1 );
 stroke ( 230 );
 noFill ();
 rect ( grpos.x , grpos.y , grsize.x , grsize.y );
 let us = grunit * grscale ;
 for ( let x = 0 ; x <= int ( grsize.x / us ); x ++) for ( let y = 0 ; y <= int ( grsize.y / us ); y ++){
  noFill ();
  if ( x < int ( grsize.x / us )&& y < int ( grsize.y / us )) rect (( x * us )+ grpos.x ,( y * us )+ grpos.y , us , us );
  if (( x == int ( grsize.x / us ))&&( y < int ( grsize.y / us )) ) rect (( x * us )+ grpos.x ,( y * us )+ grpos.y , grsize.x -( x * us ), us );
  if (( y == int ( grsize.y / us ))&&( x < int ( grsize.x / us )) ) rect (( x * us )+ grpos.x ,( y * us )+ grpos.y , us , grsize.y -( y * us ));
 }
}
function scgr (  pos ){
 return createVector (( pos.x * grscale )+ grpos.x ,( pos.y * grscale )+ grpos.y );
}
function inversescgr (  pos ){
 return createVector (( pos.x - grpos.x )/ grscale ,( pos.y - grpos.y )/ grscale );
}
function mouseshrink (  pos ){
  return createVector ( rg ( inversescgr ( pos ) .x ), rg ( inversescgr ( pos ) .y ));
}
function scgrfx (  pos ){
 return ( pos * grscale )+ grpos.x ;
}
function scgrfy (  pos ){
 return ( pos * grscale )+ grpos.y ;
}
function scsif (  pos ){
 return  pos * grscale ;
}
function rg (  fin ){
 let fout = fin + grunit * .5 ;
 fout = roundit ( fout -( fout % grunit ), 2 );
 return fout ;
}
function grscaleDEhouse (  hoin ){
 let grscaleX = grsize.x / housesizex0y1 ( ho , 0 );
 let grscaleY = grsize.y / housesizex0y1 ( ho , 1 );
 if ( grscaleX < grscaleY ) grscale = grscaleX ;
 else grscale = grscaleY ;
 // print ( "x:" + grsize.x / grscale + " y:" + grsize.y / grscale );
 // print ( "x:" + housesizex0y1 ( ho , 0 )+ " y:" + housesizex0y1 ( ho , 1 ));
}
function housesizex0y1 (  hoin  ,  x0y1 ){
 let vout = 0 ;
 if ( x0y1 == 0 ) vout = hoin.homedges [  0 ] .pt [ 1 ] .x ;
 if ( x0y1 == 1 ) vout = hoin.homedges [  0 ] .pt [ 1 ] .y ;
 if ( x0y1 == 0 ) for ( let i = 0 ; i < hoin.homedges.length ; i ++) if ( hoin.homedges [  i ] .pt [ 1 ] .x > vout ) vout = hoin.homedges [  i ] .pt [ 1 ] .x ;
  if ( x0y1 == 1 ) for ( let i = 0 ; i < hoin.homedges.length ; i ++) if ( hoin.homedges [  i ] .pt [ 1 ] .y > vout ) vout = hoin.homedges [  i ] .pt [ 1 ] .y ; 
 return vout ;
}
