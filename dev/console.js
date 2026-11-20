const { Performancer2, DateFormatter } = Std.all;

const Performancer3 = class Performancer3 {

  static create(...args) {
    return new this(...args);
  }

  static format = {
    milliseconds: function(ms) {
      return (parseFloat(ms) / 1000).toFixed(3);
    },
    percentage: function(percen) {
      return `${percen.toFixed(2)}%`;
    }
  };

  static classes = {
    Report: class Performancer3Report {
      constructor(performancer) {
        this.performancer = performancer;
      }
      print() {
        Std.classes.Printer.json(this.performancer.metrics);
      }
    }
  };

  constructor(name, parent = null) {
    this.name = name;
    this.parent = parent;
    this.children = {};
    if(parent) {
      parent.children[name] = this;
    }
    this.wasStarted = false;
    this.wasStopped = false;
  }

  task(name) {
    return this.children[name] || new this.constructor(name, this);
  }

  areDates(...args) {
    for(let index=0; index<args.length; index++) {
      const arg = args[index];
      if(!(arg instanceof Date)) return false;
    }
    return true;
  }

  getMetrics() {
    const lastMoment = this.wasClosed || new Date();
    const metrics = { since: lastMoment, points: [] };
    let pivot = this;
    let currentLevel = 1;
    const selfDuration = lastMoment - this.wasStarted;
    Iterating_parents:
    while(pivot) {
      if(!pivot.parent) break Iterating_parents;
      const unit = { relation: `«${this.name}» in «${pivot.parent.name}» [L:${currentLevel++}]` };
      unit.since = pivot.parent.wasStarted;
      unit.to = lastMoment;
      const hasLimits = this.areDates(unit.since, unit.to);
      if(hasLimits) {
        const parentheticalDuration = unit.to - unit.since;
        unit.duration = this.constructor.format.milliseconds(parentheticalDuration);
        unit.partiality = this.constructor.format.percentage(selfDuration / parentheticalDuration);
      } else {
        unit.duration = null;
        unit.partiality = null;
      }
      metrics.points.unshift(unit);
      pivot = pivot.parent;
    }
    return metrics;
  }

  start(msg) {
    $moduler.assert(!this.wasStarted, `Cannot start performancer «${this.name}» because it was already started yet`);
    $moduler.assert(!this.wasStopped, `Cannot start performancer «${this.name}» because it was already closed`);
    const metrics = this.getMetrics();
    this.wasStarted = metrics.since;
    return this;
  }

  message(msg) {
    $moduler.assert(this.wasStarted, `Cannot print message from performancer «${this.name}» because it was not started yet`);
    $moduler.assert(!this.wasStopped, `Cannot print message from performancer «${this.name}» because it was already closed`);
    const metrics = this.getMetrics();
    console.log(metrics);
    return this;
  }

  stop(msg) {
    $moduler.assert(this.wasStarted, `Cannot stop performancer «${this.name}» because it was not started yet`);
    $moduler.assert(!this.wasStopped, `Cannot stop performancer «${this.name}» because it was already closed`);
    const metrics = this.getMetrics();
    this.wasStopped = metrics.since;
    return this;
  }

  get report() {
    return new this.constructor.classes.Report(this);
  }

};

const perfor = Performancer3.create("Módulo A").start("111");

perfor.task("Proceso 1").start("Iniciando");
perfor.task("Proceso 1").task("Funcionalidad 1.1").start("222");
perfor.task("Proceso 1").task("Funcionalidad 1.1").message("Paso 1");
perfor.task("Proceso 1").task("Funcionalidad 1.1").message("Paso 2");
perfor.task("Proceso 1").task("Funcionalidad 1.1").message("Paso 3");
perfor.task("Proceso 1").task("Funcionalidad 1.1").stop("333");
perfor.task("Proceso 1").task("Funcionalidad 1.2").start("444");
perfor.task("Proceso 1").task("Funcionalidad 1.2").stop("555");
perfor.task("Proceso 1").task("Funcionalidad 1.3").start("666");
perfor.task("Proceso 1").task("Funcionalidad 1.3").stop("777");
perfor.stop().report.print({ details: 1 });

// Y esto último tiene que imprimir:

/*

[perf] [Modulo A] <start> [@0.000] [+0.001=0%] [+0.002=0%] 111
[perf] [Modulo A] [Proceso 1] <stop> [@0.000] [+0.001=0%] [+0.002=0%] Iniciando
[perf] [Modulo A] [Proceso 1] [Funcionalidad 1.1] <start> [@0.000] [+0.001=0%] [+0.002=0%] 222
[perf] [Modulo A] [Proceso 1] [Funcionalidad 1.1] <stop> [@0.000] [+0.001=0%] [+0.002=0%] 333

*//*

Si te fijas, es:

[perf]: siempre fijo
[Modulo A]: el "name" del performancer raíz.
<start>|<stop>|<message>: el método que lo ha llamado.
[@n.nnn]: esto es el tiempo desde el start del performancer raiz
[+n.nnn=mm%]: Los n.nnn son el tiempo desde el start del performancer raiz no, sino del parent. Por eso se repiten, porque puede tener varios parents.
  - El mm% indica cuánto tiempo ocupa, el perf actual, tomando desde el start hasta el stop (si es que los tiene), del perf pariente de ese recuadrito. 
111|222|333|...: son un mensajito que te dejas para identificar esa llamada

Si te fijas, el task no necesita que se sepa qué pasos tiene, sino que si no lo encuentra ya creado, lo crea. Son instancias igual que la raíz, pero con un parent no null.

*/