# moduler-v6-starter-v2

Lo mismo que el starter original, pero CompilerV6 y DevBinaryV6 pasan a ~V7.

## ¿Qué mejora?

- Más simple todo:
   - para lectura:
      - tiene muchos menos ficheros
   - para cómputo:
      - tiene muchos menos métodos
      - va mucho más directo
      - se han omitido muchas funcionalidades que tenían hype pero luego caían en desuso
- Más flexibilidad y velocidad de cambio
   - el original es muy funcionalmente constrictor
   - cualquier cambio chorra era demasiado rato siguiendo el flujo para entender cómo proceder
- Más limpio
   - volvemos a un proyecto despejado
   - con las funcionalidades mínimas y más usadas
   - menos dependencias
   - más precisión
- Retrocompaible
   - no fully, pero las ideas son las mismas, y la carcasa mantiene las mismas conclusiones

## ¿Por qué lo vuelves a hacer?

El error principal con la anterior ha sido lo siguiente.

- Empiezas a meter features, con lecturas a ficheros, te empiezas a comer tiempo del loop.
- Dejas de controlar flujos así un poco críticos/recursivos, te vas comiendo más loop.
- Pones un evento extra, que hace la misma compilación que otro evento del flujo, estas duplicando el tiempo del loop.
- Hay un punto donde, lo que habías logrado reducir a menos de 1 segundo, está quitándote 5 segundos, y no sabes cómo.
   - Pero ese no era el trato
   - Y no parece la casuística
   - Y tienes que rehacerlo porque debugar un laberinto no sirve más que:
      - para quitarte tiempo
      - para irte colando presión subliminal
   - Y no compensa tener un desarrollo para ir más rápido, quitándote tiempo así
   - Y las features que rescataría, pensé, son muy pocas
      - no hay tantas razones para quedarse comiendo 5 segundos por iteración
      - y técnicamente, no veía ni justificación, ni solución rápida
- Por tanto, la conclusión fue bastante unívoca: hay que rehacerlo, aunque sea con peggyjs para ir más rápido.
   - Y llevó 1 o 2 días, pero si hace el loop y escucha abierta, ya está, ya gano.

Mis conclusiones son iguales que en líneas anteriores:

- El original era muy verboso
   - Empecé a escribirlo sin tener claros los requisitos
      - Tenía claros algunos requisitos, más que un Grunt pero menos que un TypeScript/Rollup/Webpack...
      - Pero muchas features las fui incorporando de forma escalonada, improvisada, sin trackeo ninguno...
         - Y la pelota se fue haciendo.
         - Y no podía compilar los pegjs porque no había huevos a acertar con el hook.
         - Y me pasaría lo mismo con nuevas extensiones
         - Y ya está, se veía que era lastre
         - Y esta solución es mejor.

Sobre todo, lo que más preocupa, es el laberinto que se forma, no dejar que se forme. Pero a veces, y esta ha sido una más, al no tener claros los requisitos a medio y largo plazo, procedes a resolver, porque quieres resolverlo de alguna forma aunque sea, pero (a veces no, muchas veces no, incluso, la mayoría de veces no) notas que flaqueas, que entras al problema pero no tienes todos los frentes de batalla claros.

En conclusión, que... han sido varios intentos, no tantos como con Moduler, quizá más si miramos atrás.

Pero... de CompilerV6 al V7, había que ir. Y lo sabíamos, pero que había que fallarlo, el V6, porque si no no ves los requisitos que el medio y largo plazo te tienen preparado.
      