(function() {
const localCase = {
name: "Zombie Health 01",
source: `# Zombie Health 01 (case,start)

~ =100

![Doctor](../cases/images/doctor.png)

Você é um Médico Girafa que foi chamado para ajudar a curar zumbis que foram picados por animais peçonhentos.

Você tem ^points^ pontos.

* Iniciar Jogo -> Fase 1

# Fase 1 (case)

![Zumbis](../cases/images/zumbis1.png)

<H1>Fase 1</H1>

Descubra o que picou cada Zumbi. Você tem que ser rápido, porque tem que atender 10 zumbis.

* Iniciar Fase 1 -> 1







# 1 (case)

![zumbi_1](../cases/images/zumbi_1.png)

Undeadha se apresentou na clínica reclamando que algum bicho o picou ou mordeu, o que você deseja examinar?

* Local da Picada -> Mostra Sintoma(sente pouca dor no local da mordida  ; local levemente inchado)
* Estado do Zumbi -> Mostra Sintoma(está com os olhos normais; respira e engole de forma regular)
* Ferida -> Mostra Sintoma(tem uma ferida sem destaques além daqueles já descritos)
* Batimentos -> Mostra Sintoma(tem batimentos cardíacos descompassados, num ritmo atrapalhado)

* Realizar Diagnóstico -> Diagnóstico escorpião

# 2 (case)

![zumbi_2](../cases/images/zumbi_2.png)

Pricensteinia se apresentou na clínica reclamando que algum bicho o picou ou mordeu, o que você deseja examinar?

* Local da Picada -> Mostra Sintoma(sente muita dor no local da mordida  ; local inchado)
* Estado do Zumbi -> Mostra Sintoma(está com os olhos normais; respira e engole de forma regular)
* Ferida -> Mostra Sintoma(tem uma ferida grande, com bordas elevadas e tem uma área preta no meio)
* Batimentos -> Mostra Sintoma(tem batimentos cardíacos normais)

* Realizar Diagnóstico -> Diagnóstico aranha marrom

# 3 (case)

![zumbi_3](../cases/images/zumbi_3.png)

Tor-grr se apresentou na clínica reclamando que algum bicho o picou ou mordeu, o que você deseja examinar?

* Local da Picada -> Mostra Sintoma(sente muita dor no local da mordida ; o local está mudando para uma coloração azul ; local muito inchado)
* Estado do Zumbi -> Mostra Sintoma(está com os olhos normais; respira e engole de forma regular)
* Ferida -> Mostra Sintoma(tem uma ferida grande, com bordas elevadas e tem uma área preta no meio)
* Batimentos -> Mostra Sintoma(tem batimentos cardíacos normais)

* Realizar Diagnóstico -> Diagnóstico jararaca

# 4 (case)

![zumbi_4](../cases/images/zumbi_4.png)

Grrmurray se apresentou na clínica reclamando que algum bicho o picou ou mordeu, o que você deseja examinar?

* Local da Picada -> Mostra Sintoma(sente pouca dor no local da mordida  ; local levemente inchado)
* Estado do Zumbi -> Mostra Sintoma(está com os olhos normais; respira e engole de forma regular)
* Ferida -> Mostra Sintoma(tem uma ferida sem destaques além daqueles já descritos)
* Batimentos -> Mostra Sintoma(tem batimentos cardíacos descompassados, num ritmo atrapalhado)

* Realizar Diagnóstico -> Diagnóstico escorpião

# 5 (case)

![zumbi_5](../cases/images/zumbi_5.png)

Frankenperez se apresentou na clínica reclamando que algum bicho o picou ou mordeu, o que você deseja examinar?

* Local da Picada -> Mostra Sintoma(sente pouca dor no local da mordida  ; local levemente inchado)
* Estado do Zumbi -> Mostra Sintoma(está cansado para respirar)
* Ferida -> Mostra Sintoma(tem uma ferida sem destaques além daqueles já descritos)
* Batimentos -> Mostra Sintoma(tem batimentos cardíacos descompassados, num ritmo atrapalhado)

* Realizar Diagnóstico -> Diagnóstico escorpião

# 6 (case)

![zumbi_6](../cases/images/zumbi_6.png)

Sananimated se apresentou na clínica reclamando que algum bicho o picou ou mordeu, o que você deseja examinar?

* Local da Picada -> Mostra Sintoma(sente muita dor no local da mordida  ; local muito inchado)
* Estado do Zumbi -> Mostra Sintoma(está com os olhos normais; respira e engole de forma regular)
* Ferida -> Mostra Sintoma(tem uma ferida grande, com bordas elevadas e tem uma área preta no meio)
* Batimentos -> Mostra Sintoma(tem batimentos cardíacos normais)

* Realizar Diagnóstico -> Diagnóstico jararaca

# 7 (case)

![zumbi_7](../cases/images/zumbi_7.png)

Grrgriffiths se apresentou na clínica reclamando que algum bicho o picou ou mordeu, o que você deseja examinar?

* Local da Picada -> Mostra Sintoma(sente pouca dor no local da mordida  )
* Estado do Zumbi -> Mostra Sintoma(está com o olho caído)
* Ferida -> Mostra Sintoma(tem uma ferida sem destaques além daqueles já descritos)
* Batimentos -> Mostra Sintoma(tem batimentos cardíacos normais)

* Realizar Diagnóstico -> Diagnóstico cascavel

# 8 (case)

![zumbi_8](../cases/images/zumbi_8.png)

Brooks-grr se apresentou na clínica reclamando que algum bicho o picou ou mordeu, o que você deseja examinar?

* Local da Picada -> Mostra Sintoma(sente muita dor no local da mordida  ; local levemente inchado)
* Estado do Zumbi -> Mostra Sintoma(está com os olhos normais; respira e engole de forma regular)
* Ferida -> Mostra Sintoma(tem uma ferida sem destaques além daqueles já descritos)
* Batimentos -> Mostra Sintoma(tem batimentos cardíacos descompassados, num ritmo atrapalhado)

* Realizar Diagnóstico -> Diagnóstico escorpião

# 9 (case)

![zumbi_9](../cases/images/zumbi_9.png)

Grrreen se apresentou na clínica reclamando que algum bicho o picou ou mordeu, o que você deseja examinar?

* Local da Picada -> Mostra Sintoma(sente muita dor no local da mordida ; o local está mudando para uma coloração azul ; local muito inchado)
* Estado do Zumbi -> Mostra Sintoma(está com os olhos normais; respira e engole de forma regular)
* Ferida -> Mostra Sintoma(tem uma ferida sem destaques além daqueles já descritos)
* Batimentos -> Mostra Sintoma(tem batimentos cardíacos normais)

* Realizar Diagnóstico -> Diagnóstico jararaca

# 10 (case)

![zumbi_10](../cases/images/zumbi_10.png)

Williarot se apresentou na clínica reclamando que algum bicho o picou ou mordeu, o que você deseja examinar?

* Local da Picada -> Mostra Sintoma(sente muita dor no local da mordida  ; local levemente inchado)
* Estado do Zumbi -> Mostra Sintoma(está com os olhos normais; respira e engole de forma regular)
* Ferida -> Mostra Sintoma(tem uma ferida sem destaques além daqueles já descritos)
* Batimentos -> Mostra Sintoma(tem batimentos cardíacos descompassados, num ritmo atrapalhado)

* Realizar Diagnóstico -> Diagnóstico escorpião









# Mostra Sintoma (note)

O zumbi <>.

# Diagnóstico jararaca (case)

![Treatment](../cases/images/doctor.png)

Então, qual animal peçonhento você acha que picou o paciente?

* Jararaca -> Jararaca certo
* Cascavel -> Jararaca errado

* Aranha Marrom -> Jararaca errado
* Escorpião -> Jararaca errado

# Diagnóstico cascavel (case)

![Treatment](../cases/images/doctor.png)

Então, qual animal peçonhento você acha que picou o paciente?

* Jararaca -> Cascavel errado
* Cascavel -> Cascavel certo

* Aranha Marrom -> Cascavel errado
* Escorpião -> Cascavel errado

# Diagnóstico aranha marrom (case)

![Treatment](../cases/images/doctor.png)

Então, qual animal peçonhento você acha que picou o paciente?

* Jararaca -> Aranha Marrom errado
* Cascavel -> Aranha Marrom errado

* Aranha Marrom -> Aranha Marrom certo
* Escorpião -> Aranha Marrom errado

# Diagnóstico escorpião (case)

![Treatment](../cases/images/doctor.png)

Então, qual animal peçonhento você acha que picou o paciente?

* Jararaca -> Escorpião errado
* Cascavel -> Escorpião errado

* Aranha Marrom -> Escorpião errado
* Escorpião -> Escorpião certo

# 11 (case)

![Zumbis](../cases/images/zumbis2.png)

<H1>Fase 2</H1>

Agora você já é um médico treinado e está pronto para resolver casos mais difíceis.

<dcc-trigger action="knot/>/navigate" label="Iniciar Fase 2"></dcc-trigger>

# 12 (case)

![zumbi_1](../cases/images/1.png)

O paciente chega ao pronto socorro mancando. Ele foi pescar larvas nojentas que moram na lagoa perto de sua casa. Acidentalmente, o paciente pegou o rabo de um bicho, que o mordeu. O que você deseja examinar?

* Local da Picada -> Dor Sangramento Edema
* Estado do Paciente -> Estado normal
* Ferida -> Necrose sim
* Batimentos -> Arritmia não

* Realizar Diagnóstico -> Diagnóstico 1

# 13 (case)

![zumbi_2](../cases/images/2.png)

Um novo paciente se apresentou na clínica para ser atendido. Ele diz que estava planejando assustar umas pessoas e resolveu se esconder dentro de um barril na sua casa. Então, acabou sentando em cima de um bicho que fazia um barulho esquisito com o rabo. O que você deseja examinar?

* Local da Picada -> Dor Edema discreto
* Estado do Paciente -> Olho Deglutição Respiração
* Ferida -> Necrose não
* Batimentos -> Arritmia não

* Realizar Diagnóstico -> Diagnóstico 2

# 14 (case)

![zumbi_3](../cases/images/3.png)

Um novo zumbi apareceu na clínica. O paciente relata que estava atrasado para ir para escola Zumbi para aprender a domesticar zumboscas - moscas que foram para Zumbilândia depois de comerem comida estragada. Então, ele colocou o sapato correndo e sentiu uma dor no dedão do pé. Nesse momento, percebeu que esmagou alguma coisa, mas não deu muita importância. Ao correr, o paciente começou a sentir uma dor muito forte no pé e percebeu que estava com uma ferida no dedão. O que você deseja examinar?

* Local da Picada -> Dor Edema
* Estado do Paciente -> Estado normal
* Ferida -> Necrose sim
* Batimentos -> Arritmia não

* Realizar Diagnóstico -> Diagnóstico 3

# 15 (case)

![zumbi_4](../cases/images/4.png)

Um novo zumbi chegou ao pronto-socorro! Ele conta que estava coletando sucata para fazer um brinquedo novo, e viu um bicho esquisito. Quando ele chegou perto do bicho, levou uma ferroada na mão que doeu tanto que ele pulou igual um macaco. Ele diz ainda que a sua galinha de estimação correu para ajudar, e o bicho esquisito saiu correndo de medo. O que você deseja examinar?

* Local da Picada -> Dor muita Edema discreto
* Estado do Paciente -> Respiração
* Ferida -> Necrose não
* Batimentos -> Arritmia sim

* Realizar Diagnóstico -> Diagnóstico 4

# 16 (case)

![zumbi_5](../cases/images/5.png)

Um novo paciente chegou à clínica! Ele relata que foi passear de barco e parou numa ilha que tinha um farol muito bonito. Quando ele desceu do barco, percebeu que a ilha tinha um monte de Zumbirinhas, um tipo de gaivota da Zumbilândia. Como está sempre com fome, o paciente foi pegar um ovo para fazer uma boquinha, mas sentiu uma dor muito forte na mão. O que você deseja examinar?

* Local da Picada -> Dor Sangramento Edema
* Estado do Paciente -> Estado normal
* Ferida -> Necrose sim
* Batimentos -> Arritmia não

* Realizar Diagnóstico -> Diagnóstico 5

# 17 (case)

![zumbi_6](../cases/images/6.png)

Um zumbi acabou de chegar à clinica! Ele relata que foi pescar na mata. Logo antes de chegar no rio, viu um bicho se que fazia um barulho engraçadinho com o rabo. Então, o paciente saiu atrás do bicho e, quando se abaixou para encostar nele, o animal pulou e lhe deu uma mordida no braço. O que você deseja examinar?

* Local da Picada -> Dor Edema discreto
* Estado do Paciente -> Olho Deglutição Respiração
* Ferida -> Necrose não
* Batimentos -> Arritmia não

* Realizar Diagnóstico -> Diagnóstico 6

# 18 (end)
![Final](../cases/images/end.jpg)
Parabéns você chegou ao final do jogo! Foi sugado por um buraco negro e vai começar tudo de novo em outra dimensão!

Você fez o total de <dcc-expression expression="points" active></dcc-expression> pontos.

# Dor Sangramento Edema (note)

![Dor_Muita](https://cdn.pixabay.com/photo/2016/03/31/15/31/cry-1293366_960_720.png)

O paciente está com muita dor no local da mordida, que também está muito inchado e mudando para uma coloração azul.

# Dor Edema discreto (note)

![Dor_Pouca](https://cdn.pixabay.com/photo/2012/04/24/13/27/face-40058_960_720.png)

O paciente sente pouca dor, e o local da picada tem pouco inchaço.

# Dor muita Edema discreto (note)

![Dor_Muita](https://cdn.pixabay.com/photo/2016/03/31/15/31/cry-1293366_960_720.png)

O paciente sente muita dor, e o local da picada tem pouco inchaço.

# Dor Edema (note)

![Dor_Pouca](https://cdn.pixabay.com/photo/2012/04/24/13/27/face-40058_960_720.png)

O local do ferimento apresenta inchaço e o paciente sente dor.

# Estado normal (note)

Não foi observado nada de anormal no paciente.

# Olho Deglutição Respiração (note)

O paciente está com o olho caído, tem dificuldade para engolir e está cansado para respirar.

# Respiração (note)

![Respiracao_Problema](https://cdn.pixabay.com/photo/2014/04/03/11/58/human-312757_960_720.png)

Ao examinar o paciente, você percebe que ele está cansado para respirar.

# Necrose não (note)

Nada mais a observar na ferida.

# Necrose sim (note)

A ferida é grande, com bordas elevadas e tem uma área preta no meio.

# Arritmia não (note)

![Arritmia_Nao](https://cdn.pixabay.com/photo/2015/07/15/18/15/health-846780_960_720.png)

Seus batimentos cardíacos estão normais.

# Arritmia sim (note)

![Arritmia_Sim](https://cdn.pixabay.com/photo/2014/04/02/10/39/heartbeat-304130_960_720.png)

Os batimentos estão descompassados, num ritmo atrapalhado.

# Diagnóstico 1 (case)

Use as cores verde (1 clique), azul (2 cliques) e vermelho (3 cliques) para indicar:
- verde - ajudaram você a descobrir o animal;
- azul - nem ajudaram nem atrapalharam a descoberta;
- vermelho - lhe atrapalharam ou confundiram na descoberta do animal.


? contribution to diagnostics
  * type: group select
  * vocabularies: evidence.finding relevance
  * states: _,+,=,-
  * labels: neutral, corroborate, equal, against

{{symptoms/evidence.finding relevance/

<p>O paciente chega ao pronto socorro mancando. Ele {foi pescar larvas nojentas}/=/ que moram na lagoa perto de sua casa. Acidentalmente, o paciente {pegou o rabo de um bicho, que o mordeu}/+/. Ele está com {muita dor no local da mordida}/+/ e percebeu que {sua perna está inchada}/+/ e {mudando para uma coloração azul}/+/. Ao examinar o estado do paciente, {você não descobre nada anormal}/=/. Seus {batimentos cardíacos também estão normais}/=/. Porém, ao examinar a ferida, você percebe que ela é {grande, com bordas elevadas e tem uma área preta no meio}/+/.</p>

}}

<p>Então, qual animal peçonhento você acha que picou o paciente?</p>

* Jararaca -> Jararaca certo
* Cascavel -> Jararaca errado
* Aranha Marrom -> Jararaca errado
* Escorpião -> Jararaca errado

# Diagnóstico 2 (case)

Use as cores verde (1 clique), azul (2 cliques) e vermelho (3 cliques) para indicar:
- verde - ajudaram você a descobrir o animal;
- azul - nem ajudaram nem atrapalharam a descoberta;
- vermelho - lhe atrapalharam ou confundiram na descoberta do animal.
? contribution to diagnostics
  * type: group select
  * vocabularies: evidence.finding relevance
  * states: _,+,=,-
  * labels: neutral, corroborate, equal, against

{{symptoms/evidence.finding relevance/

<p>O paciente diz que {estava planejando assustar umas pessoas}/=/ e resolveu {se esconder dentro de um barril na sua casa}/=/. Então, acabou sentando em cima de {um bicho que fazia um barulho esquisito com o rabo}/+/. O paciente {sente pouca dor}/=/, e {o local da picada tem pouco inchaço}/=/. O paciente também está com o {olho caído}/+/, tem {dificuldade para engolir}/+/ e está {cansado para respirar}/+/. A ferida {não apresenta nenhuma característica marcante}/=/. Além disso, seus {batimentos cardíacos estão normais}/=/.</p>

}}

<p>Então, qual animal peçonhento você acha que picou o paciente?</p>

* Jararaca -> Cascavel errado
* Cascavel -> Cascavel certo
* Aranha Marrom -> Cascavel errado
* Escorpião -> Cascavel errado

# Diagnóstico 3 (case)

Use as cores verde (1 clique), azul (2 cliques) e vermelho (3 cliques) para indicar:
- verde - ajudaram você a descobrir o animal;
- azul - nem ajudaram nem atrapalharam a descoberta;
- vermelho - lhe atrapalharam ou confundiram na descoberta do animal.
? contribution to diagnostics
  * type: group select
  * vocabularies: evidence.finding relevance
  * states: _,+,=,-
  * labels: neutral, corroborate, equal, against

{{symptoms/evidence.finding relevance/

<p>O paciente relata que {estava atrasado para ir para escola Zumbi para aprender a domesticar zumboscas}/=/ - moscas que foram para Zumbilândia depois de comerem comida estragada. Então, {ele colocou o sapato correndo}/=/ e sentiu uma dor no dedão do pé. Nesse momento, {percebeu que esmagou alguma coisa}/+/, mas não deu muita importância. {Ao correr, o paciente começou a sentir uma dor muito forte no pé}/+/ e percebeu que estava com uma ferida no dedão. O local do ferimento {apresenta inchaço}/+/, e {a ferida é grande, com bordas elevadas e tem uma área preta no meio}/+/. Ao examinar o paciente, {você não descobre nada anormal}/=/. Seus {batimentos cardíacos estão normais}/=/.</p>

}}

<p>Então, qual animal peçonhento você acha que picou o paciente?</p>

* Jararaca -> Aranha Marrom errado
* Cascavel -> Aranha Marrom errado
* Aranha Marrom -> Aranha Marrom certo
* Escorpião -> Aranha Marrom errado

# Diagnóstico 4 (case)

Use as cores verde (1 clique), azul (2 cliques) e vermelho (3 cliques) para indicar:
- verde - ajudaram você a descobrir o animal;
- azul - nem ajudaram nem atrapalharam a descoberta;
- vermelho - lhe atrapalharam ou confundiram na descoberta do animal.
? contribution to diagnostics
  * type: group select
  * vocabularies: evidence.finding relevance
  * states: _,+,=,-
  * labels: neutral, corroborate, equal, against

{{symptoms/evidence.finding relevance/

<p>O paciente conta que estava {coletando sucata para fazer um brinquedo novo}/=/, e {viu um bicho esquisito}/=/. Quando ele chegou perto do bicho, {levou uma ferroada na mão que doeu tanto}/+/ que ele pulou igual um macaco. Ele diz ainda que a {sua galinha de estimação correu para ajudar}/+/, e o bicho esquisito saiu correndo de medo. Ao chegar na clínica, o paciente {sente muita dor}/+/, e {o local da picada tem pouco inchaço}/=/. Ao examinar o paciente, você percebe que {ele está cansado para respirar}/+/. A ferida {não apresenta nenhuma característica marcante}/=/, mas seus {batimentos cardíacos estão descompassados, num ritmo atrapalhado}/+/.</p>

}}

<p>Então, qual animal peçonhento você acha que picou o paciente?</p>

* Jararaca -> Escorpião errado
* Cascavel -> Escorpião errado
* Aranha Marrom -> Escorpião errado
* Escorpião -> Escorpião certo

# Diagnóstico 5 (case)

Use as cores verde (1 clique), azul (2 cliques) e vermelho (3 cliques) para indicar:
- verde - ajudaram você a descobrir o animal;
- azul - nem ajudaram nem atrapalharam a descoberta;
- vermelho - lhe atrapalharam ou confundiram na descoberta do animal.
? contribution to diagnostics
  * type: group select
  * vocabularies: evidence.finding relevance
  * states: _,+,=,-
  * labels: neutral, corroborate, equal, against

{{symptoms/evidence.finding relevance/

<p>O paciente relata que {foi passear de barco}/=/ e {parou numa ilha que tinha um farol muito bonito}/=/. Quando ele desceu do barco, {percebeu que a ilha tinha um monte de Zumbirinhas}/=/, um tipo de gaivota da Zumbilândia. Como está sempre com fome, o paciente {foi pegar um ovo para fazer uma boquinha}/=/, mas {sentiu uma dor muito forte na mão}/+/. Ao chegar na clínica, o paciente está com {muita dor no local da mordida}/+/, que também está {muito inchado}/+/ e {mudando para uma coloração azul}/+/. Ao examinar o paciente, {você não descobre nada anormal}/=/. Seus {batimentos cardíacos estão normais}/=/. Entretanto, {a ferida é grande, com bordas elevadas e tem uma área preta no meio}/+/.</p>

}}

<p>Então, qual animal peçonhento você acha que picou o paciente?</p>

* Jararaca -> Jararaca certo
* Cascavel -> Jararaca errado
* Aranha Marrom -> Jararaca errado
* Escorpião -> Jararaca errado

# Diagnóstico 6 (case)

Use as cores verde (1 clique), azul (2 cliques) e vermelho (3 cliques) para indicar:
- verde - ajudaram você a descobrir o animal;
- azul - nem ajudaram nem atrapalharam a descoberta;
- vermelho - lhe atrapalharam ou confundiram na descoberta do animal.
? contribution to diagnostics
  * type: group select
  * vocabularies: evidence.finding relevance
  * states: _,+,=,-
  * labels: neutral, corroborate, equal, against

{{symptoms/evidence.finding relevance/

<p>O paciente relata que {foi pescar na mata}/=/. Logo antes de chegar no rio, viu {um bicho se que fazia um barulho engraçadinho com o rabo}/+/. Então, o paciente saiu atrás do bicho e, {quando se abaixou para encostar nele}/=/, o animal pulou e lhe {deu uma mordida}/+/ no braço. {olho caído}/+/, tem {dificuldade para engolir}/+/ e está {cansado para respirar}/+/. A ferida {não apresenta nenhuma característica marcante}/=/. Além disso, seus {batimentos cardíacos estão normais}/=/.</p>

}}

<p>Então, qual animal peçonhento você acha que picou o paciente?</p>

* Jararaca -> Cascavel errado
* Cascavel -> Cascavel certo
* Aranha Marrom -> Cascavel errado
* Escorpião -> Cascavel errado

# Jararaca certo (right)

~ +10

![Certo](https://cdn.pixabay.com/photo/2019/06/26/20/30/zombie-4301192_960_720.png)

![Jararaca](https://media.giphy.com/media/26DN0U3SqKDG2fTFe/giphy.gif)

Parabéns! Você diagnosticou corretamente e pôde dar ao paciente um soro contra veneno de **Jararaca**.

Você tem <dcc-expression expression="points" active></dcc-expression> pontos.

<dcc-trigger action="knot/>/navigate" label="Próximo Caso"></dcc-trigger>

# Jararaca errado (wrong)

~ -10

![Errado](../cases/images/treatment-wrong.png)

![Jararaca](https://media.giphy.com/media/26DN0U3SqKDG2fTFe/giphy.gif)

Infelizmente você fez o tratamento incorreto... O paciente foi picado por uma **Jararaca**.

Você tem <dcc-expression expression="points" active></dcc-expression> pontos.

<dcc-trigger action="knot/>/navigate" label="Próximo Caso"></dcc-trigger>

# Cascavel certo (right)

~ +10

![Certo](https://cdn.pixabay.com/photo/2019/06/26/20/30/zombie-4301192_960_720.png)

![Cascavel](https://media.giphy.com/media/dEfPULgo1DYfm/giphy.gif)

Parabéns! Você diagnosticou corretamente, e pôde dar ao paciente um soro contra veneno de **Cascavel**.

Você tem <dcc-expression expression="points" active></dcc-expression> pontos.

<dcc-trigger action="knot/>/navigate" label="Próximo Caso"></dcc-trigger>

# Cascavel errado (wrong)

~ -10

![Errado](../cases/images/treatment-wrong.png)

![Cascavel](https://media.giphy.com/media/dEfPULgo1DYfm/giphy.gif)

Infelizmente você fez o tratamento incorreto... O paciente foi picado por uma **Cascavel**.

Você tem <dcc-expression expression="points" active></dcc-expression> pontos.

<dcc-trigger action="knot/>/navigate" label="Próximo Caso"></dcc-trigger>

# Aranha Marrom certo (right)

~ +10

![Certo](https://cdn.pixabay.com/photo/2019/06/26/20/30/zombie-4301192_960_720.png)

![AranhaMarrom](https://media.giphy.com/media/1k2UWbJCWqvXtq1xDJ/giphy.gif)

Parabéns! Você diagnosticou corretamente, e pôde dar ao paciente um soro contra veneno de **Aranha Marrom**.

Você tem <dcc-expression expression="points" active></dcc-expression> pontos.

<dcc-trigger action="knot/>/navigate" label="Próximo Caso"></dcc-trigger>

# Aranha Marrom errado (wrong)

~ -10

![Errado](../cases/images/treatment-wrong.png)

![AranhaMarrom](https://media.giphy.com/media/1k2UWbJCWqvXtq1xDJ/giphy.gif)

Infelizmente você fez o tratamento incorreto... O paciente foi picado por uma **Aranha Marrom**.

Você tem <dcc-expression expression="points" active></dcc-expression> pontos.

<dcc-trigger action="knot/>/navigate" label="Próximo Caso"></dcc-trigger>

# Escorpião certo (right)

~ +10

![Certo](https://cdn.pixabay.com/photo/2019/06/26/20/30/zombie-4301192_960_720.png)

![Escorpião](https://media.giphy.com/media/QscbCkTeoBb68/giphy.gif)

Parabéns! Você diagnosticou corretamente, e pôde dar ao paciente um soro contra veneno de **Escorpião**.

Você tem <dcc-expression expression="points" active></dcc-expression> pontos.

<dcc-trigger action="knot/>/navigate" label="Próximo Caso"></dcc-trigger>

# Escorpião errado (wrong)

~ -10

![Errado](../cases/images/treatment-wrong.png)

![Escorpião](https://media.giphy.com/media/QscbCkTeoBb68/giphy.gif)

Infelizmente você fez o tratamento incorreto... O paciente foi picado por um **Escorpião**.

Você tem <dcc-expression expression="points" active></dcc-expression> pontos.

<dcc-trigger action="knot/>/navigate" label="Próximo Caso"></dcc-trigger>

____ Data _____
* theme: zombie`
};

MessageBus.int.publish("control/case/load/ready", localCase);
})();
