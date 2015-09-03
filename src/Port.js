function Port(id, dir, brick) {
  if(['in','out'].indexOf(dir) === -1) throw "port direction must be 'in' or 'out'";
  // var attrs = { width: 30, height: 30, fill: '#B8D430', stroke: 'black', 'stroke-width': 3 };
  var attrs = { r: 10, fill: '#B8D430', stroke: 'black', 'stroke-width': 3.5 };
  this._el = Sticky.createElement('circle', attrs);
  this._el.wrapper = this;
  this._el.type = 'port';
  this._brick = brick;
  this._maxcon = 2;
  this._conn = [];
  this.id = id;
  this.type = 'port';
  this.dir = dir; //dir -> direction, not directory

  return this;
}

Port.prototype = {
  get x () { return this.attr('cx') *1; }, //force coercion to number
  get y () { return this.attr('cy') *1; },
  get available () { return this._conn.length < this._maxcon; },
  attr(key, value) {
    if(value) return this._el.setAttribute(key, value);
    else return this._el.getAttribute(key);
  },
  value() {
    this._brick.getValue();
    // this.wrapper.getValue(this._id);
  },
  getPoint() {
    return { x: this._brick.x + this.x, y: this._brick.y + this.y };

  },
  attach(to) {
    if(this.available && to.available) {
      this._conn.push({ brick: to._brick._id, id: to.id });
      to._conn.push({ brick: this._brick._id, id: this.id });
      return true;
    } else {
      return false;
    }
  }
};
