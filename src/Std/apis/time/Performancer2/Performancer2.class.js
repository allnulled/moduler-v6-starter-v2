class Performancer2 {

  static create(title) {
    return new this(title);
  }

  static classes = {
    Report: class PerformancerReport {
      constructor(performancer) {
        this.performancer = performancer;
        this.metradata = this.performancer.collectMetrics();
      }
      print(options = null) {
        if (options?.message) {
          this.performancer.printMessage(Std.functions.classicStringFormat(message, { ...this.metradata }), this.metradata.name + ".print");
        } else {
          Std.classes.Printer.json(this.metradata);
        }
      }
      replaceMetricsNodes(tree, callback, parent = null) {
        const replacement = callback(tree, parent) ?? tree;
        if (!replacement.children) {
          replacement.children = tree.children;
        }
        for (let index = 0; index < tree.children.length; index++) {
          const child = tree.children[index];
          replacement.children[index] = this.replaceMetricsNodes(child, callback, tree);
        }
        return replacement;
      }
      printSummary1Replacer(it, parent, now) {
        const { DateFormatter } = Std.all;
        const start = it.start;
        const stop = it.stop || now;
        const took = start ? (stop - start) / 1000 : null;

        let percentagePart = null;

        if (parent?.start && start) {
          const parentStart = parent.start;
          const parentStop = parent.stop || now;
          const parentTook = parentStop - parentStart;

          if (parentTook > 0) {
            const childStart = Math.max(start, parentStart);
            const childStop = Math.min(stop, parentStop);
            const childTook = Math.max(0, childStop - childStart);

            percentagePart = Number((childTook / parentTook * 100).toFixed(2));
          }
        }

        const data = {
          name: it.name,
          start: start ? DateFormatter.formatDate(start, { onError: () => "?" }) : "?",
          stop: it.stop ? DateFormatter.formatDate(it.stop, { onError: () => "?" }) : "?",
          took: took === null ? "?" : took.toFixed(3),
          percentagePart
        };

        this.performancer.printMessage(
          `${data.name} took ${data.took}s${percentagePart === null ? "" : ` (${percentagePart}%)`}`
        );

        return data;
      }
      printSummary1() {
        const now = new Date();
        const out = this.replaceMetricsNodes(this.metradata, this.printSummary1Replacer.bind(this));
        console.log(out);
        return out;
      }
      printSummary1_before_chatgpt() {
        const tree = JSON.parse(JSON.stringify(this.metradata));
        const { DateFormatter } = Std.all;
        const replacer = it => {
          const data = {
            name: it.name,
            stop: DateFormatter.formatDate(it.stop, { onError: err => "?" }),
            start: DateFormatter.formatDate(it.start, { onError: err => "?" }),
            took: (it.stop - it.start) || "?",
          };
          this.performancer.printMessage(`${data.name} took ${data.took}`);
          data.children = it.children.map(replacer);
          data.parent = it;
          return data;
        };
        const out = this.replaceMetricsNodes(tree, replacer, true);
        console.log(out);
        Format_on_root: {
          // @CHATGPT: aquí habría que mirar, de los children que están empezados, qué porcentaje, del tiempo del padre, llevan consumido, hasta el stop o hasta ahora.
          // Y esa propiedad, ponerle: percentagePart
          this.replaceMetricsNodes(out, it => {
            // it.parent
          })
        }
        return out;
      }
    }
  };

  constructor(title, parent = null) {
    this.title = title;
    this.parent = parent;
    this.children = [];
    this.wasStarted = false;
    this.wasStopped = false;
    if (parent) {
      this.parent.children.push(this);
    }
  }

  subcreate(title) {
    return new this.constructor(title, this);
  }

  collectMetrics(now = this.wasStopped || new Date()) {
    const metrics = [];
    let pivot = this;
    while (pivot) {
      Collect_difference_in_chain: {
        const diff = pivot.wasStarted ? now - pivot.wasStarted : null;
        metrics.push([pivot.title, diff, { started: pivot.wasStarted, stopped: pivot.wasStopped }]);
      }
      Up_in_chain: {
        pivot = pivot.parent;
      }
    }
    return {
      name: this.title,
      metrics: metrics,
      atMoment: now,
      start: this.wasStarted,
      stop: this.wasStopped,
      children: this.children.map(child => child.collectMetrics()),
    };
  }

  checkNotStopped(operation) {
    $moduler.assert(false === this.wasStopped, `Cannot do operation «${operation}» once the performancer unit is stopped`);
  }

  start(msg = false) {
    this.checkNotStopped("Performancer2.prototype.start");
    const metradata = this.collectMetrics();
    this.wasStarted = metradata.atMoment;
    this.printMessage(Std.functions.classicStringFormat(msg, { ...metradata }), "start");
    return this;
  }

  message(msg) {
    const metradata = this.collectMetrics();
    this.printMessage(Std.functions.classicStringFormat(msg, { ...metradata }), "message");
    return this;
  }

  stop(msg = false) {
    this.checkNotStopped("Performancer2.prototype.stop");
    const metradata = this.collectMetrics();
    this.wasStopped = metradata.atMoment;
    this.printMessage(Std.functions.classicStringFormat(msg, { ...metradata }), "stop");
    return this;
  }

  get report() {
    return new this.constructor.classes.Report(this);
  }

  get uniqueId() {
    const uid = [];
    let pivot = this;
    while (pivot) {
      Collect_id: {
        uid.unshift(pivot.title);
      }
      Up_in_chain: {
        pivot = pivot.parent;
      }
    }
    return uid.join("]+[");
  }

  getTime() {
    $moduler.assert(this.wasStarted, `Cannot «Performancer2.prototype.getTime» because it was not started`);
    return (new Date()) - this.wasStarted;
  }

  getParentheticalTime() {
    const times = [];
    const now = new Date();
    let pivot = this;
    while (pivot) {
      Collect_id: {
        times.unshift(pivot.wasStarted);
      }
      Up_in_chain: {
        pivot = pivot.parent;
      }
    }
    return times.map(time => (time ? ((now - time) / 1000).toFixed(3) : null));
  }

  printMessage(msg, actor = false) {
    if (!msg) return;
    console.log(`[pfmcr] [${this.uniqueId}] ${actor ? '[' + actor + '] ' : ''}[+${this.getParentheticalTime().join("] [+")}] ${msg}`);
  }

}