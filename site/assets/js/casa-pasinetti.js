class Component extends DCLogic {
  componentDidUpdate() { this.sync(); }

  componentWillUnmount() {
    if (this._ro) this._ro.disconnect();
    if (this._bootT) clearTimeout(this._bootT);
    if (this._play) { clearInterval(this._play); this._play = null; }
    if (this._eng) { this._eng.dispose(); this._eng = null; }
  }

  S() { return this.state || {}; }

  P() {
    const p = this.props || {};
    return {
      studio: Number(p.precoStudio ?? 300000) || 0,
      q1: Number(p.preco1q ?? 380000) || 0,
      q2: Number(p.preco2q ?? 680000) || 0,
      cambio: Number(p.cambio ?? 6.3) || 6.3,
      brl: p.mostrarReais ?? true,
      demo: p.statusDemo ?? true,
      orient: ((Number(p.orientacao ?? 172) % 360) + 360) % 360,
      wa: String(p.whatsapp ?? '').replace(/\D/g, '')
    };
  }

  I18N() {
    if (this._i18n) return this._i18n;
    const pt = {
      code: 'pt-BR', loc: 'pt-BR',
      navAria: 'Seções', navModel: 'Maquete', navProject: 'Projeto', navArea: 'Bairro', navGallery: 'Galeria', langAria: 'Idioma',
      cta: 'Agendar apresentação',
      typology: 'Tipologia', typeAria: 'Filtrar por tipologia', onlyAvail: 'Só disponíveis', colorize: 'Colorir disponibilidade',
      canvasAria: 'Maquete 3D do Casa Pasinetti. Para escolher uma unidade pelo teclado, use a lista de andares ao lado.',
      loading: 'Carregando maquete 3D…', glErr: 'Não foi possível abrir o 3D neste navegador. Use a lista de andares ao lado para ver unidades e valores.',
      eyebrow: 'Fondazione Prada · Milano', sub: '75 residências · 7 pavimentos · jardim interno · entrega prevista em 2029',
      hint: 'Arraste para girar · Ctrl + rolagem para zoom · clique numa unidade',
      legendAria: 'Legenda', disp: 'Disponível', res: 'Reservada', vend: 'Vendida', selected: 'Selecionada',
      viewAria: 'Vista', street: 'Rua', garden: 'Jardim', aerial: 'Aérea', sunView: 'Sol', sunViz: 'Sol e bússola',
      compass: ['N', 'L', 'S', 'O'], hourSuf: 'h',
      chartAria: (d) => 'Carta solar de ' + d + ': trajetória do sol e fachada da unidade', chartNote: 'Dourado: sol na data · tracejado: solstícios · laranja: fachada da unidade',
      route: 'rota a pé ↗', openMap: 'Abrir no Google Maps',
      rotAria: 'Girar e aproximar', rotL: 'Girar para a esquerda', rotR: 'Girar para a direita', zoomOut: 'Afastar', zoomIn: 'Aproximar',
      lightAria: 'Luz do dia', dateAria: 'Data', hourAria: 'Horário', play: 'Animar o dia', pause: 'Pausar',
      months: { mar: '21 mar', jun: '21 jun', set: '21 set', dez: '21 dez' },
      dirs: ['norte', 'nordeste', 'leste', 'sudeste', 'sul', 'sudoeste', 'oeste', 'noroeste'],
      sunUp: (dir) => 'sol a ' + dir,
      sunDown: 'sol abaixo do horizonte', sunrise: 'nascer', sunset: 'pôr do sol',
      backToBuilding: 'Ver prédio inteiro',
      selectedUnit: 'Unidade selecionada', estArea: 'Área estimada', floor: 'Andar', aspect: 'Vista',
      priceFrom: 'A partir de', pricePre: 'Valor de pré-lançamento', pricePreFrom: 'Pré-lançamento · a partir de', price: 'Valor', onRequest: 'Sob consulta', vat: '+ IVA',
      soldUnit: 'Unidade vendida', tableNote: 'Tabela enviada na apresentação privada', preNote: 'Valores de pré-lançamento, sujeitos a alteração',
      fx: (v, r) => '≈ ' + v + ' + IVA · câmbio de referência ' + r + ' · sujeito a alteração',
      payTitle: 'Fluxo de pagamento', payNote: 'Calculado sobre o valor inicial; sujeito a alteração.', pay: ['Na assinatura', 'Meados de 2027', 'Meados de 2028', 'Na entrega · 2029'],
      sunTitle: (d) => 'Sol direto na fachada · ' + d, sunNone: 'Sem sol direto nesta data', sunNote: 'Cálculo astronômico, sem sombras do entorno',
      ctaInterest: 'Tenho interesse nesta unidade', ctaWait: 'Entrar na lista de espera', ctaReq: 'Solicitar valores',
      similar: 'Ver unidades similares disponíveis', locate: 'Ver unidade na maquete',
      empty: 'Clique numa unidade da maquete ou escolha um andar abaixo para ver tipologia e valor.',
      explore: 'Explorar por andar', floorsAria: 'Andares',
      floorIdle: 'Escolha um andar para ver as unidades dele na maquete. Abaixo de cada número: disponíveis / total.',
      floorIso: (f, a, n) => f + ' · ' + a + ' de ' + n + ' disponíveis. Os andares acima ficam ocultos na maquete.',
      ground: 'Térreo', floorN: (n) => n + 'º andar', penthouse: 'cobertura', unit: 'Unidade',
      floorAria: (f, a, n) => f + ': ' + a + ' de ' + n + ' unidades disponíveis',
      chips: { all: 'Todas', mono: 'Studio', bi: '1 quarto', tri: '2 quartos', lux: '3+ quartos' },
      ty: { mono: 'Studio', bi: '1 quarto', tri: '2 quartos', quadri: '3 quartos', pluri: '4 quartos', lux: '3+ quartos' },
      typo: (ty, it) => ty + ' · ' + it,
      ext: { garden: 'Jardim privativo', roof: 'Terraço na cobertura', terrace: 'Terraço', dloggia: 'Loggia dupla', loggia: 'Loggia', none: 'Área externa' },
      expo: { s: 'Via Pasinetti', g: 'Jardim interno', f: 'Dupla: rua e jardim', p: 'Rua e jardim · cobertura' },
      from: 'a partir de',
      msgVisit: 'Olá! Quero agendar uma apresentação privada do Casa Pasinetti, em Milão.',
      msgInterest: (c, l, ty) => 'Olá! Tenho interesse na unidade ' + c + ' do Casa Pasinetti, em Milão (' + l + ', ' + ty + ').',
      msgWait: (c) => 'Olá! A unidade ' + c + ' do Casa Pasinetti está reservada. Quero entrar na lista de espera.',
      msgPrices: (c, l, ty) => 'Olá! Quero receber os valores da unidade ' + c + ' (' + l + ', ' + ty + ') do Casa Pasinetti, em Milão.',
      prEyebrow: 'Pré-lançamento · Entrega prevista em 2029', prTitle: 'Uma das regiões que mais se valorizam em Milão',
      prText: 'Próximo a Fondazione Prada, da Universidade Bocconi e da Moncler. Projeto assinado por arquitetos de renome na Itália: 75 residências em 7 pavimentos, com jardim interno e terraços na cobertura.',
      hiTitle: 'Diferenciais', hi: ['Rooftop com piscina, bar e lounge', 'Concierge 24h, restaurante, social lounge e coworking', 'Academia, sala de yoga e jardim interno com área fitness', 'Acabamentos italianos: Gessi, Ceramica Flaminia e parquet Noesis'],
      tbTitle: 'Tabela de pré-lançamento', tbNote: 'valores + IVA', tbTypo: ['Studio', '1 quarto', '2 quartos', '3 e 4 quartos e coberturas'],
      pfTitle: 'Fluxo de pagamento', pf: ['no ato da compra', 'em meados de 2027', 'em meados de 2028', 'na entrega, prevista para 2029'],
      mapEyebrow: 'Localização', mapTitle: 'O bairro a pé', mapIntro: 'Tempos a partir da Via Antonio Pasinetti 4–8, com os anéis de caminhada a cada 5 minutos.',
      mapNote: 'Mapa redesenhado sobre a planta da cidade, com posições aproximadas. Tempos estimados pela distância em linha reta com fator de rota de 1,25; para o trajeto exato, abra a rota a pé de cada ponto no Google Maps.',
      walk: (m) => m + ' min', walkSub: 'a pé', bike: (m) => '≈ ' + m + ' min de bicicleta', km: (k) => k + ' km em linha reta',
      poi: { prada: 'Fondazione Prada', bocconi: 'Universidade Bocconi', lodi: 'Metrô M3 · Lodi T.I.B.B.', romana: 'Metrô M3 · Porta Romana', duomo: 'Duomo di Milano' },
      mapAria: 'Mapa do bairro redesenhado sobre a planta da cidade, com anéis de caminhada e pontos de interesse', you: 'Casa Pasinetti',
      olympic: 'Vila Olímpica 2026 · Scalo Romana', insetFacade: 'fachada da rua · sul',
      insetAria: 'Planta do quarteirão: o lote entre a Via Antonio Pasinetti e a Via Gallura, junto à Via Ripamonti',
      insetCap: 'O quarteirão: o prédio ocupa o lote entre a Via Antonio Pasinetti e a Via Gallura, a uma quadra da Via Ripamonti. A fachada da rua fica voltada para o sul (≈ 172°) e o jardim interno para o norte.',
      glTitle: 'Galeria', enlarge: 'Ampliar',
      navLife: 'Vida', navInt: 'Interiores',
      amEyebrow: 'Áreas comuns', amTitle: 'Um clube dentro de casa',
      amText: 'Do lobby com concierge ao rooftop com piscina: serviços de hotel no dia a dia dos moradores. Toque em cada ambiente para ver as imagens.',
      am: {
        rooftop: { t: 'Rooftop', d: 'Piscina, pool bar e lounge com pérgola' },
        lobby: { t: 'Lobby e concierge', d: 'Recepção 24h em travertino, aberta para o jardim' },
        dining: { t: 'Restaurante e café', d: 'Do café da manhã ao jantar, sem sair do prédio' },
        lounge: { t: 'Social lounge', d: 'Salas de estar para receber e relaxar' },
        work: { t: 'Coworking', d: 'Mesas compartilhadas e sala de reunião' },
        gym: { t: 'Academia', d: 'Cardio e musculação com luz natural' },
        yoga: { t: 'Yoga e bem-estar', d: 'Estúdio para yoga, pilates e alongamento' },
        garden: { t: 'Jardim interno', d: 'Lounge com pérgola e área fitness ao ar livre' }
      },
      photos: (n) => n + (n === 1 ? ' foto' : ' fotos'),
      inEyebrow: 'Interiores', inTitle: 'Duas paletas de acabamento',
      inText: 'O apartamento-modelo foi apresentado em duas paletas: Classica Chiara, clara e luminosa, e Brown, mais quente e profunda.',
      styles: { chiara: 'Classica Chiara', brown: 'Brown' }, styleAria: 'Paleta de acabamento',
      styleNote: { chiara: 'Sala, cozinha integrada e suíte em carvalho claro, linho e travertino.', brown: 'Suíte master com marcenaria em madeira escura e tecidos em tons terrosos.' },
      fnEyebrow: 'Capitolato', fnTitle: 'Acabamentos com marcas italianas',
      fnText: 'O que já está especificado no memorial de acabamentos (capitolato) do Casa Pasinetti.',
      fin: [
        ['Piso', 'Parquet de carvalho em 3 camadas, réguas de 190 mm', 'Noesis · VETTE K2 / Everest'],
        ['Banheiros', 'Porcelanato com veio de travertino, 60 × 120 cm', 'Castelvetro · Firenze Vein cut Ivory'],
        ['Louças', 'Vaso e bidê suspensos, branco brilhante', 'Ceramica Flaminia · AP118 / AP218'],
        ['Cubas', 'Cubas de apoio, redonda ou oval', 'Ceramica Flaminia · AP40A / AP62A'],
        ['Box', 'Base de chuveiro rente ao piso, branca', 'Disenia · Piano'],
        ['Metais', 'Misturadores e chuveiro em preto fosco', 'Gessi · Via Meravigli'],
        ['Toalheiro e acessórios', 'Toalheiro aquecido e acessórios pretos', 'Irsap KART · Zazzeri Z316'],
        ['Portas', 'Portas laqueadas brancas, de abrir ou de correr', 'Idoor · ONE'],
        ['Móveis e tecidos', 'Tecidos Twin, Tallin, Medley e Lounge; madeiras olmo e nogueira; laqueados Visone, Magnolia e Canapa', 'Paleta do capitolato']
      ],
      seeInteriors: 'Ver interiores e acabamentos',
      extAlts: ['Fachada da Via Pasinetti ao anoitecer', 'Elevação da rua ao pôr do sol', 'Cobertura com terraços e jardins', 'Entrada principal à noite'],
      lbCount: (i, n) => i + ' de ' + n, galNote: 'Imagens ilustrativas do projeto',
      realBtn: 'Ver real', realBack: 'Voltar à maquete 3D', realTitle: 'Imagens oficiais do projeto', realHint: 'Toque nos ícones da maquete para ver cada ambiente como ele é',
      hsLabels: { rooftop: 'Piscina no rooftop', garden: 'Jardim e lounge', lobby: 'Lobby e concierge', dining: 'Café e restaurante', lounge: 'Social lounge', gym: 'Fitness room', work: 'Co-working', garage: 'Garagem' },
      garageBtn: 'Garagem', garageTitle: 'Garagem em 2 subsolos', garageDesc: 'Subsolos a −3,12 m e −5,98 m, com rampas a partir do portão de veículos na Via Antonio Pasinetti. Vagas vendidas à parte; distribuição das vagas ilustrativa.', garageBack: 'Voltar à maquete',
      alts: ['Fachada para a Via Pasinetti ao entardecer', 'Esquina com os terraços da cobertura ao pôr do sol', 'Perspectiva da Via Pasinetti à noite', 'Fachada interna voltada para o jardim', 'Vista diurna das loggias e da cobertura'],
      ctaTitle: 'Apresentação privada para investidores', ctaText: 'Material completo, plantas e disponibilidade atualizada do Casa Pasinetti.', ctaWa: 'Falar no WhatsApp', ctaUnits: 'Ver unidades', presentedBy: 'Exclusividade no Brasil',
      foot1: 'Distribuição das unidades, metragens e disponibilidade na maquete são ilustrativas. Valores da tabela de pré-lançamento, sujeitos a alteração. Posição do sol calculada para Milão.',
      foot2: 'Exclusividade Gobbi Consultoria no Brasil · Imagens ilustrativas · Via Antonio Pasinetti 4–8, Milano',
      close: 'Fechar', prev: 'Imagem anterior', next: 'Próxima imagem'
    };
    const it = {
      code: 'it', loc: 'it-IT',
      navAria: 'Sezioni', navModel: 'Modello 3D', navProject: 'Progetto', navArea: 'Quartiere', navGallery: 'Galleria', langAria: 'Lingua',
      cta: 'Prenota una presentazione',
      typology: 'Tipologia', typeAria: 'Filtra per tipologia', onlyAvail: 'Solo disponibili', colorize: 'Mostra disponibilità',
      canvasAria: 'Modello 3D di Casa Pasinetti. Per scegliere un’unità da tastiera, usa l’elenco dei piani a lato.',
      loading: 'Caricamento del modello 3D…', glErr: 'Impossibile aprire il 3D in questo browser. Usa l’elenco dei piani a lato per vedere unità e prezzi.',
      eyebrow: 'Fondazione Prada · Milano', sub: '75 residenze · 7 piani · giardino interno · consegna prevista nel 2029',
      hint: 'Trascina per ruotare · Ctrl + rotella per lo zoom · clicca su un’unità',
      legendAria: 'Legenda', disp: 'Disponibile', res: 'Riservata', vend: 'Venduta', selected: 'Selezionata',
      viewAria: 'Vista', street: 'Strada', garden: 'Giardino', aerial: 'Aerea', sunView: 'Sole', sunViz: 'Sole e bussola',
      compass: ['N', 'E', 'S', 'O'], hourSuf: ':00',
      chartAria: (d) => 'Diagramma solare del ' + d + ': percorso del sole e facciata dell’unità', chartNote: 'Oro: sole nella data · tratteggio: solstizi · arancio: facciata dell’unità',
      route: 'percorso a piedi ↗', openMap: 'Apri in Google Maps',
      rotAria: 'Ruota e zoom', rotL: 'Ruota a sinistra', rotR: 'Ruota a destra', zoomOut: 'Allontana', zoomIn: 'Avvicina',
      lightAria: 'Luce del giorno', dateAria: 'Data', hourAria: 'Ora', play: 'Anima la giornata', pause: 'Pausa',
      months: { mar: '21 mar', jun: '21 giu', set: '21 set', dez: '21 dic' },
      dirs: ['nord', 'nord-est', 'est', 'sud-est', 'sud', 'sud-ovest', 'ovest', 'nord-ovest'],
      sunUp: (dir) => 'sole a ' + dir,
      sunDown: 'sole sotto l’orizzonte', sunrise: 'alba', sunset: 'tramonto',
      backToBuilding: 'Vedi tutto l’edificio',
      selectedUnit: 'Unità selezionata', estArea: 'Superficie stimata', floor: 'Piano', aspect: 'Affaccio',
      priceFrom: 'A partire da', pricePre: 'Prezzo di prelancio', pricePreFrom: 'Prelancio · a partire da', price: 'Prezzo', onRequest: 'Su richiesta', vat: '+ IVA',
      soldUnit: 'Unità venduta', tableNote: 'Listino inviato nella presentazione privata', preNote: 'Prezzi di prelancio, soggetti a variazione',
      fx: (v, r) => v, payTitle: 'Piano di pagamento', payNote: 'Calcolato sul prezzo di partenza; soggetto a variazione.', pay: ['Alla firma', 'Metà 2027', 'Metà 2028', 'Alla consegna · 2029'],
      sunTitle: (d) => 'Sole diretto in facciata · ' + d, sunNone: 'Nessun sole diretto in questa data', sunNote: 'Calcolo astronomico, senza ombre del contesto',
      ctaInterest: 'Sono interessato a questa unità', ctaWait: 'Entra in lista d’attesa', ctaReq: 'Richiedi i prezzi',
      similar: 'Vedi unità simili disponibili', locate: 'Mostra l’unità nel modello',
      empty: 'Clicca su un’unità del modello o scegli un piano qui sotto per vedere tipologia e prezzo.',
      explore: 'Esplora per piano', floorsAria: 'Piani',
      floorIdle: 'Scegli un piano per vederne le unità nel modello. Sotto ogni numero: disponibili / totale.',
      floorIso: (f, a, n) => f + ' · ' + a + ' di ' + n + ' disponibili. I piani superiori sono nascosti nel modello.',
      ground: 'Piano terra', floorN: (n) => n + '° piano', penthouse: 'attico', unit: 'Unità',
      floorAria: (f, a, n) => f + ': ' + a + ' di ' + n + ' unità disponibili',
      chips: { all: 'Tutte', mono: 'Monolocale', bi: 'Bilocale', tri: 'Trilocale', lux: 'Quadrilocale +' },
      ty: { mono: 'Monolocale', bi: 'Bilocale', tri: 'Trilocale', quadri: 'Quadrilocale', pluri: 'Plurilocale', lux: 'Plurilocale' },
      typo: (ty, it, beds) => ty + ' · ' + beds,
      beds: { mono: 'open space', bi: '1 camera', tri: '2 camere', quadri: '3 camere', pluri: '4 camere', lux: '3+ camere' },
      ext: { garden: 'Giardino privato', roof: 'Terrazza sul tetto', terrace: 'Terrazzo', dloggia: 'Doppia loggia', loggia: 'Loggia', none: 'Spazio esterno' },
      expo: { s: 'Via Pasinetti', g: 'Giardino interno', f: 'Doppio: strada e giardino', p: 'Strada e giardino · attico' },
      from: 'da',
      msgVisit: 'Buongiorno! Vorrei prenotare una presentazione privata di Casa Pasinetti, a Milano.',
      msgInterest: (c, l, ty) => 'Buongiorno! Sono interessato all’unità ' + c + ' di Casa Pasinetti (' + l + ', ' + ty + ').',
      msgWait: (c) => 'Buongiorno! L’unità ' + c + ' di Casa Pasinetti è riservata. Vorrei entrare in lista d’attesa.',
      msgPrices: (c, l, ty) => 'Buongiorno! Vorrei ricevere i prezzi dell’unità ' + c + ' (' + l + ', ' + ty + ') di Casa Pasinetti.',
      prEyebrow: 'Prelancio · Consegna prevista nel 2029', prTitle: 'Una delle zone di Milano in più forte crescita',
      prText: 'Vicino alla Fondazione Prada, all’Università Bocconi e a Moncler. Progetto firmato da architetti di fama in Italia: 75 residenze su 7 piani, con giardino interno e terrazze sul tetto.',
      hiTitle: 'Plus', hi: ['Rooftop con piscina, bar e lounge', 'Concierge 24h, ristorante, social lounge e coworking', 'Palestra, sala yoga e giardino interno con area fitness', 'Finiture italiane: Gessi, Ceramica Flaminia e parquet Noesis'],
      tbTitle: 'Listino di prelancio', tbNote: 'prezzi + IVA', tbTypo: ['Monolocale', 'Bilocale', 'Trilocale', 'Quadrilocali, plurilocali e attici'],
      pfTitle: 'Piano di pagamento', pf: ['alla firma', 'a metà 2027', 'a metà 2028', 'alla consegna, prevista nel 2029'],
      mapEyebrow: 'Posizione', mapTitle: 'Il quartiere a piedi', mapIntro: 'Tempi da Via Antonio Pasinetti 4–8, con anelli di cammino ogni 5 minuti.',
      mapNote: 'Mappa ridisegnata sulla pianta della città, posizioni approssimative. Tempi stimati dalla distanza in linea d’aria con fattore di percorso 1,25; per il tragitto esatto apri il percorso a piedi di ogni punto in Google Maps.',
      walk: (m) => m + ' min', walkSub: 'a piedi', bike: (m) => '≈ ' + m + ' min in bici', km: (k) => k + ' km in linea d’aria',
      poi: { prada: 'Fondazione Prada', bocconi: 'Università Bocconi', lodi: 'Metro M3 · Lodi T.I.B.B.', romana: 'Metro M3 · Porta Romana', duomo: 'Duomo di Milano' },
      mapAria: 'Mappa del quartiere ridisegnata sulla pianta della città, con anelli dei tempi a piedi e punti di interesse', you: 'Casa Pasinetti',
      olympic: 'Villaggio Olimpico 2026 · Scalo Romana', insetFacade: 'facciata su strada · sud',
      insetAria: 'Pianta dell’isolato: il lotto tra Via Antonio Pasinetti e Via Gallura, vicino a Via Ripamonti',
      insetCap: 'L’isolato: l’edificio occupa il lotto tra Via Antonio Pasinetti e Via Gallura, a un isolato da Via Ripamonti. La facciata su strada è rivolta a sud (≈ 172°), il giardino interno a nord.',
      glTitle: 'Galleria', enlarge: 'Ingrandisci',
      navLife: 'Vivere', navInt: 'Interni',
      amEyebrow: 'Spazi comuni', amTitle: 'Un club dentro casa',
      amText: 'Dalla lobby con concierge al rooftop con piscina: servizi da hotel nella vita di tutti i giorni. Tocca ogni ambiente per vedere le immagini.',
      am: {
        rooftop: { t: 'Rooftop', d: 'Piscina, pool bar e lounge con pergola' },
        lobby: { t: 'Lobby e concierge', d: 'Reception 24h in travertino, aperta sul giardino' },
        dining: { t: 'Ristorante e caffè', d: 'Dalla colazione alla cena, senza uscire di casa' },
        lounge: { t: 'Social lounge', d: 'Salotti per ricevere e rilassarsi' },
        work: { t: 'Coworking', d: 'Postazioni condivise e sala riunioni' },
        gym: { t: 'Palestra', d: 'Cardio e pesi con luce naturale' },
        yoga: { t: 'Yoga e benessere', d: 'Studio per yoga, pilates e stretching' },
        garden: { t: 'Giardino interno', d: 'Lounge con pergola e area fitness all’aperto' }
      },
      photos: (n) => n + ' foto',
      inEyebrow: 'Interni', inTitle: 'Due palette di finiture',
      inText: 'L’appartamento modello è presentato in due palette: Classica Chiara, chiara e luminosa, e Brown, più calda e profonda.',
      styles: { chiara: 'Classica Chiara', brown: 'Brown' }, styleAria: 'Palette di finiture',
      styleNote: { chiara: 'Soggiorno, cucina a vista e camera in rovere chiaro, lino e travertino.', brown: 'Camera padronale con boiserie in legno scuro e tessuti nei toni della terra.' },
      fnEyebrow: 'Capitolato', fnTitle: 'Finiture firmate da marchi italiani',
      fnText: 'Quanto già previsto nel capitolato delle finiture di Casa Pasinetti.',
      fin: [
        ['Pavimenti', 'Parquet in rovere a tre strati, doghe da 190 mm', 'Noesis · VETTE K2 / Everest'],
        ['Bagni', 'Gres effetto travertino, 60 × 120 cm', 'Castelvetro · Firenze Vein cut Ivory'],
        ['Sanitari', 'WC e bidet sospesi, bianco lucido', 'Ceramica Flaminia · AP118 / AP218'],
        ['Lavabi', 'Lavabi d’appoggio, tondi o ovali', 'Ceramica Flaminia · AP40A / AP62A'],
        ['Doccia', 'Piatto doccia filo pavimento, bianco', 'Disenia · Piano'],
        ['Rubinetteria', 'Miscelatori e set doccia nero opaco', 'Gessi · Via Meravigli'],
        ['Scaldasalviette e accessori', 'Scaldasalviette e accessori neri', 'Irsap KART · Zazzeri Z316'],
        ['Porte', 'Porte laccate bianche, a battente o scorrevoli', 'Idoor · ONE'],
        ['Arredi e tessuti', 'Tessuti Twin, Tallin, Medley e Lounge; legni olmo e noce; laccati Visone, Magnolia e Canapa', 'Palette del capitolato']
      ],
      seeInteriors: 'Vedi interni e finiture',
      extAlts: ['Facciata su Via Pasinetti all’imbrunire', 'Prospetto su strada al tramonto', 'Piano attico con terrazze e giardini', 'Ingresso principale di sera'],
      lbCount: (i, n) => i + ' di ' + n, galNote: 'Immagini illustrative del progetto',
      realBtn: 'Vista reale', realBack: 'Torna al modello 3D', realTitle: 'Immagini ufficiali del progetto', realHint: 'Tocca le icone sul modello per vedere ogni ambiente com’è davvero',
      hsLabels: { rooftop: 'Piscina sul rooftop', garden: 'Giardino e lounge', lobby: 'Lobby e concierge', dining: 'Café e ristorante', lounge: 'Social lounge', gym: 'Fitness room', work: 'Co-working', garage: 'Autorimessa' },
      garageBtn: 'Autorimessa', garageTitle: 'Autorimessa su 2 piani interrati', garageDesc: 'Piani interrati a −3,12 m e −5,98 m, con rampe dal cancello carraio su Via Antonio Pasinetti. Posti auto venduti separatamente; disposizione dei posti indicativa.', garageBack: 'Torna al modello',
      alts: ['Facciata su Via Pasinetti al crepuscolo', 'Angolo con le terrazze sul tetto al tramonto', 'Prospettiva di Via Pasinetti di sera', 'Facciata interna sul giardino', 'Vista diurna delle logge e del tetto'],
      ctaTitle: 'Presentazione privata per investitori', ctaText: 'Materiale completo, planimetrie e disponibilità aggiornata di Casa Pasinetti.', ctaWa: 'Scrivici su WhatsApp', ctaUnits: 'Vedi le unità', presentedBy: 'In esclusiva per il Brasile',
      foot1: 'Distribuzione delle unità, superfici e disponibilità nel modello sono indicative. Prezzi di prelancio soggetti a variazione. Posizione del sole calcolata per Milano.',
      foot2: 'In esclusiva per il Brasile: Gobbi Consultoria · Immagini illustrative · Via Antonio Pasinetti 4–8, Milano',
      close: 'Chiudi', prev: 'Immagine precedente', next: 'Immagine successiva'
    };
    const en = {
      code: 'en', loc: 'en-GB',
      navAria: 'Sections', navModel: '3D model', navProject: 'Project', navArea: 'Neighbourhood', navGallery: 'Gallery', langAria: 'Language',
      cta: 'Book a presentation',
      typology: 'Type', typeAria: 'Filter by type', onlyAvail: 'Available only', colorize: 'Show availability',
      canvasAria: '3D model of Casa Pasinetti. To choose a unit with the keyboard, use the floor list alongside.',
      loading: 'Loading 3D model…', glErr: 'This browser could not open the 3D model. Use the floor list alongside to see units and prices.',
      eyebrow: 'Fondazione Prada · Milan', sub: '75 residences · 7 storeys · inner garden · completion expected 2029',
      hint: 'Drag to rotate · Ctrl + scroll to zoom · click a unit',
      legendAria: 'Legend', disp: 'Available', res: 'Reserved', vend: 'Sold', selected: 'Selected',
      viewAria: 'View', street: 'Street', garden: 'Garden', aerial: 'Aerial', sunView: 'Sun', sunViz: 'Sun & compass',
      compass: ['N', 'E', 'S', 'W'], hourSuf: ':00',
      chartAria: (d) => 'Sun-path chart for ' + d + ': the sun’s track and the unit’s façade', chartNote: 'Gold: sun on this date · dashed: solstices · orange: unit façade',
      route: 'walking route ↗', openMap: 'Open in Google Maps',
      rotAria: 'Rotate and zoom', rotL: 'Rotate left', rotR: 'Rotate right', zoomOut: 'Zoom out', zoomIn: 'Zoom in',
      lightAria: 'Daylight', dateAria: 'Date', hourAria: 'Time', play: 'Play the day', pause: 'Pause',
      months: { mar: '21 Mar', jun: '21 Jun', set: '21 Sep', dez: '21 Dec' },
      dirs: ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'],
      sunUp: (dir) => 'sun in the ' + dir,
      sunDown: 'sun below the horizon', sunrise: 'sunrise', sunset: 'sunset',
      backToBuilding: 'Show whole building',
      selectedUnit: 'Selected unit', estArea: 'Est. area', floor: 'Floor', aspect: 'Aspect',
      priceFrom: 'From', pricePre: 'Pre-launch price', pricePreFrom: 'Pre-launch · from', price: 'Price', onRequest: 'On request', vat: '+ VAT',
      soldUnit: 'Unit sold', tableNote: 'Price list shared in the private presentation', preNote: 'Pre-launch prices, subject to change',
      fx: (v, r) => v, payTitle: 'Payment plan', payNote: 'Based on the starting price; subject to change.', pay: ['On signing', 'Mid-2027', 'Mid-2028', 'On completion · 2029'],
      sunTitle: (d) => 'Direct sun on the façade · ' + d, sunNone: 'No direct sun on this date', sunNote: 'Astronomical calculation, ignoring shading from surroundings',
      ctaInterest: 'I’m interested in this unit', ctaWait: 'Join the waiting list', ctaReq: 'Request prices',
      similar: 'See similar available units', locate: 'Show unit in the model',
      empty: 'Click a unit in the model or pick a floor below to see its type and price.',
      explore: 'Explore by floor', floorsAria: 'Floors',
      floorIdle: 'Pick a floor to see its units in the model. Under each number: available / total.',
      floorIso: (f, a, n) => f + ' · ' + a + ' of ' + n + ' available. Upper floors are hidden in the model.',
      ground: 'Ground floor', floorN: (n) => n + (n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th') + ' floor', penthouse: 'penthouse', unit: 'Unit',
      floorAria: (f, a, n) => f + ': ' + a + ' of ' + n + ' units available',
      chips: { all: 'All', mono: 'Studio', bi: '1 bed', tri: '2 bed', lux: '3+ bed' },
      ty: { mono: 'Studio', bi: '1 bedroom', tri: '2 bedrooms', quadri: '3 bedrooms', pluri: '4 bedrooms', lux: '3+ bedrooms' },
      typo: (ty, it) => ty + ' · ' + it,
      ext: { garden: 'Private garden', roof: 'Roof terrace', terrace: 'Terrace', dloggia: 'Double loggia', loggia: 'Loggia', none: 'Outdoor area' },
      expo: { s: 'Via Pasinetti', g: 'Inner garden', f: 'Dual: street and garden', p: 'Street and garden · penthouse' },
      from: 'from',
      msgVisit: 'Hello! I would like to book a private presentation of Casa Pasinetti in Milan.',
      msgInterest: (c, l, ty) => 'Hello! I’m interested in unit ' + c + ' at Casa Pasinetti, Milan (' + l + ', ' + ty + ').',
      msgWait: (c) => 'Hello! Unit ' + c + ' at Casa Pasinetti is reserved. I’d like to join the waiting list.',
      msgPrices: (c, l, ty) => 'Hello! I’d like to receive prices for unit ' + c + ' (' + l + ', ' + ty + ') at Casa Pasinetti, Milan.',
      prEyebrow: 'Pre-launch · Completion expected 2029', prTitle: 'One of Milan’s fastest-appreciating districts',
      prText: 'Close to Fondazione Prada, Bocconi University and Moncler. Designed by renowned Italian architects: 75 residences over 7 storeys, with an inner garden and roof terraces.',
      hiTitle: 'Highlights', hi: ['Rooftop with pool, bar and lounge', '24-hour concierge, restaurant, social lounge and coworking', 'Gym, yoga studio and inner garden with outdoor fitness', 'Italian finishes: Gessi, Ceramica Flaminia and Noesis parquet'],
      tbTitle: 'Pre-launch price list', tbNote: 'prices + VAT', tbTypo: ['Studio', '1 bedroom', '2 bedrooms', '3–4 bedrooms and penthouses'],
      pfTitle: 'Payment plan', pf: ['on signing', 'in mid-2027', 'in mid-2028', 'on completion, expected in 2029'],
      mapEyebrow: 'Location', mapTitle: 'The neighbourhood on foot', mapIntro: 'Times from Via Antonio Pasinetti 4–8, with walking rings every 5 minutes.',
      mapNote: 'Map redrawn from the city plan; positions are approximate. Times estimated from straight-line distance with a 1.25 route factor; for the exact path, open each walking route in Google Maps.',
      walk: (m) => m + ' min', walkSub: 'walk', bike: (m) => '≈ ' + m + ' min by bike', km: (k) => k + ' km as the crow flies',
      poi: { prada: 'Fondazione Prada', bocconi: 'Bocconi University', lodi: 'M3 metro · Lodi T.I.B.B.', romana: 'M3 metro · Porta Romana', duomo: 'Milan Cathedral' },
      mapAria: 'Neighbourhood map redrawn from the city plan, with walking-time rings and points of interest', you: 'Casa Pasinetti',
      olympic: 'Olympic Village 2026 · Scalo Romana', insetFacade: 'street façade · south',
      insetAria: 'Block plan: the lot between Via Antonio Pasinetti and Via Gallura, next to Via Ripamonti',
      insetCap: 'The block: the building sits on the lot between Via Antonio Pasinetti and Via Gallura, one block from Via Ripamonti. The street façade faces south (≈ 172°) and the inner garden faces north.',
      glTitle: 'Gallery', enlarge: 'Enlarge',
      navLife: 'Living', navInt: 'Interiors',
      amEyebrow: 'Shared spaces', amTitle: 'A private club at home',
      amText: 'From the concierge lobby to the rooftop pool: hotel-style services as part of everyday life. Tap each space to see the images.',
      am: {
        rooftop: { t: 'Rooftop', d: 'Pool, pool bar and pergola lounge' },
        lobby: { t: 'Lobby & concierge', d: '24-hour reception in travertine, opening onto the garden' },
        dining: { t: 'Restaurant & café', d: 'Breakfast to dinner without leaving the building' },
        lounge: { t: 'Social lounge', d: 'Living rooms for hosting and unwinding' },
        work: { t: 'Coworking', d: 'Shared desks and a meeting room' },
        gym: { t: 'Gym', d: 'Cardio and weights in natural light' },
        yoga: { t: 'Yoga & wellness', d: 'Studio for yoga, pilates and stretching' },
        garden: { t: 'Inner garden', d: 'Pergola lounge and outdoor fitness area' }
      },
      photos: (n) => n + (n === 1 ? ' photo' : ' photos'),
      inEyebrow: 'Interiors', inTitle: 'Two finish palettes',
      inText: 'The show apartment is presented in two palettes: Classica Chiara, light and airy, and Brown, warmer and deeper.',
      styles: { chiara: 'Classica Chiara', brown: 'Brown' }, styleAria: 'Finish palette',
      styleNote: { chiara: 'Living room, open kitchen and bedroom in light oak, linen and travertine.', brown: 'Master bedroom with dark wood panelling and earth-toned fabrics.' },
      fnEyebrow: 'Specification', fnTitle: 'Finishes by Italian brands',
      fnText: 'What is already specified in the Casa Pasinetti finishes schedule (capitolato).',
      fin: [
        ['Floors', 'Three-layer oak parquet, 190 mm boards', 'Noesis · VETTE K2 / Everest'],
        ['Bathrooms', 'Travertine-effect porcelain, 60 × 120 cm', 'Castelvetro · Firenze Vein cut Ivory'],
        ['Sanitaryware', 'Wall-hung WC and bidet, glossy white', 'Ceramica Flaminia · AP118 / AP218'],
        ['Basins', 'Countertop basins, round or oval', 'Ceramica Flaminia · AP40A / AP62A'],
        ['Shower', 'Flush-to-floor shower tray, white', 'Disenia · Piano'],
        ['Taps', 'Mixers and shower set in matt black', 'Gessi · Via Meravigli'],
        ['Towel rail & accessories', 'Heated towel rail and black accessories', 'Irsap KART · Zazzeri Z316'],
        ['Doors', 'White lacquered doors, hinged or sliding', 'Idoor · ONE'],
        ['Furniture & fabrics', 'Twin, Tallin, Medley and Lounge fabrics; elm and walnut woods; Visone, Magnolia and Canapa lacquers', 'Capitolato palette']
      ],
      seeInteriors: 'See interiors and finishes',
      extAlts: ['Façade on Via Pasinetti at nightfall', 'Street elevation at sunset', 'Penthouse floor with terraces and gardens', 'Main entrance at night'],
      lbCount: (i, n) => i + ' / ' + n, galNote: 'Illustrative images of the project',
      realBtn: 'Real view', realBack: 'Back to the 3D model', realTitle: 'Official project images', realHint: 'Tap the icons on the model to see each space as it really is',
      hsLabels: { rooftop: 'Rooftop pool', garden: 'Garden & lounge', lobby: 'Lobby & concierge', dining: 'Café & restaurant', lounge: 'Social lounge', gym: 'Fitness room', work: 'Co-working', garage: 'Garage' },
      garageBtn: 'Garage', garageTitle: 'Two-level underground garage', garageDesc: 'Basement levels at −3.12 m and −5.98 m, with ramps from the car gate on Via Antonio Pasinetti. Parking spaces sold separately; layout shown is indicative.', garageBack: 'Back to the model',
      alts: ['Façade on Via Pasinetti at dusk', 'Corner with the roof terraces at sunset', 'Via Pasinetti by night', 'Garden façade', 'Daytime view of the loggias and roof'],
      ctaTitle: 'Private presentation for investors', ctaText: 'Full brochure, floor plans and up-to-date availability for Casa Pasinetti.', ctaWa: 'Message us on WhatsApp', ctaUnits: 'See units', presentedBy: 'Exclusive in Brazil',
      foot1: 'Unit layout, areas and availability in the model are indicative. Pre-launch prices subject to change. Sun position computed for Milan.',
      foot2: 'Exclusively in Brazil through Gobbi Consultoria · Illustrative images · Via Antonio Pasinetti 4–8, Milan',
      close: 'Close', prev: 'Previous image', next: 'Next image'
    };
    this._i18n = { pt: pt, it: it, en: en };
    return this._i18n;
  }

  lang() { const l = this.S().lang; return l === 'it' || l === 'en' ? l : 'pt'; }
  tr() { return this.I18N()[this.lang()]; }

  TY() {
    return {
      mono: { line: 'Smart Living', it: 'Monolocale', group: 'mono', base: 34 },
      bi: { line: 'Comfort Living', it: 'Bilocale', group: 'bi', base: 52 },
      tri: { line: 'Exclusive Living', it: 'Trilocale', group: 'tri', base: 78 },
      quadri: { line: 'Luxury Living', it: 'Quadrilocale', group: 'lux', base: 104 },
      pluri: { line: 'Luxury Living', it: 'Plurilocale', group: 'lux', base: 140 },
      lux: { line: 'Luxury Living', it: 'Plurilocale', group: 'lux', base: 100 }
    };
  }

  floorName(f) {
    const t = this.tr();
    if (f === 0) return t.ground;
    if (f === 6) return t.floorN(6) + ' · ' + t.penthouse;
    return t.floorN(f);
  }

  typoOf(u) {
    const t = this.tr(), TY = this.TY();
    return t.typo(t.ty[u.type], TY[u.type].it, t.beds ? t.beds[u.type] : '') + (u.f === 6 ? ' · ' + t.penthouse : '');
  }

  model() {
    if (this._model) return this._model;
    const self = this;
    const TY = this.TY();
    const hash = (str) => {
      let h = 2166136261;
      for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
      return h >>> 0;
    };
    // units from the developer's keyplan (26.05.15): code, typology, area (m², envelope of the coloured plan), loggia/terrace (m²),
    // exposure row, facades for the sun study, centroid and footprint polygon in model metres (x, z pairs)
    const KP = [["A1.1","mono",24,9,"g","g",[-11.2,-2.58],[-13.78,-5.88,-13.89,-2.84,-13.79,-3.51,-11.36,-3.59,-11.36,-1.92,-13.78,-2.05,-13.75,-1.13,-13.2,-1.13,-13.2,0.4,-9.13,0.39,-8.84,-1.22,-8.17,-1.22,-8.17,-2.78,-8.44,-2.18,-10.11,-2.18,-10.11,-3.38,-8.17,-3.34,-8.17,-4.36,-10.52,-4.47,-11.62,-6.36,-11.62,-5.88]],["A1.2","bi",35,0,"s","s",[-12.27,3.89],[-16.86,4.15,-16.53,4.15,-16.53,4.48,-14.94,4.48,-14.94,5.68,-16.53,5.68,-16.53,6.01,-16.86,6.01,-16.86,6.44,-8.17,6.44,-8.17,5.32,-10.47,5.39,-10.47,3.52,-8.17,3.56,-8.19,1.48,-8.96,1.48,-8.96,0.54,-10.55,0.54,-10.55,1.13,-11.72,1.13,-11.72,2.04,-16.29,2.04,-16.29,3.54,-16.86,3.54]],["A1.3","bi",29,0,"s","s",[-20.89,4.35],[-25.33,6.44,-16.83,6.44,-16.83,5.04,-17.09,5.64,-18.77,5.64,-18.77,4.44,-16.83,4.48,-16.83,3.02,-17.59,3.02,-17.59,2.08,-20.05,2.08,-20.05,2.46,-20.95,2.46,-20.95,2.04,-22.38,2.04,-22.38,2.6,-25.33,2.6,-25.33,3.74,-22.84,3.7,-22.84,5.26,-25.33,5.21]],["A1.4","mono",25,0,"s","s",[-27.93,3.27],[-30.68,3.44,-30.34,3.44,-30.34,3.77,-28.76,3.77,-28.76,4.97,-30.34,4.97,-30.34,5.29,-30.68,5.29,-30.68,6.44,-25.32,6.44,-25.32,5.92,-26.94,5.93,-27.45,5.27,-26.94,4.6,-25.32,4.76,-25.32,4.22,-25.89,4.22,-25.89,2.15,-25.32,2.15,-25.18,1.79,-25.32,0.35,-29.91,0.45,-30.01,2.53,-30.68,2.53]],["A1.5","tri",45,10,"g","g",[-25.21,-2.21],[-30.34,-3.05,-30.34,-2.47,-28.76,-2.47,-28.76,-1.27,-30.34,-1.27,-30.34,-0.73,-30.1,-0.73,-30.1,0.4,-23.95,0.52,-23.77,0.35,-20.87,0.35,-20.59,-1.27,-19.91,-1.27,-19.91,-1.99,-22.41,-1.89,-22.41,-3.54,-19.91,-3.45,-19.91,-4.36,-22.26,-4.47,-22.98,-5.88,-24.93,-5.88,-24.93,-4.36,-29.93,-4.29,-30.1,-3.05]],["B1.1","mono",22,9,"g","g",[6.11,-2.67],[3.54,-5.88,3.54,-3.51,5.96,-3.59,5.96,-1.92,3.54,-2.05,3.57,-1.23,4.12,-1.23,4.12,0.4,5.62,0.4,5.62,0.11,8.36,0.11,8.45,-1.32,9.15,-1.32,9.15,-2.78,8.88,-2.18,7.21,-2.18,7.21,-3.38,9.15,-3.34,9.15,-4.36,6.8,-4.47,5.69,-6.35,5.69,-5.88]],["B1.2","mono",24,0,"s","s",[6.43,3.68],[3.88,2.04,3.9,6.44,9.15,6.44,9.15,5.8,7.05,5.87,7.05,4.58,9.15,4.63,9.15,2.56,8.81,2.56,8.81,2.23,7.23,2.23,7.23,1.03,8.81,1.03,8.81,0.7,9.15,0.7,9.15,0.17,6.17,0.17,6.17,2.04]],["B1.3","mono",22,0,"s","s",[0.52,4.12],[-2.63,4.41,-2.63,6.44,3.91,6.44,3.91,5.03,3.65,5.63,1.97,5.63,1.97,4.43,3.91,4.46,3.91,3.61,3.22,3.61,3.12,2.08,-2.37,2.04,-2.37,4.41]],["B1.4","mono",24,0,"s","s",[-5.49,3.68],[-8.2,0.7,-7.87,0.7,-7.87,1.03,-6.28,1.03,-6.28,2.23,-7.87,2.23,-7.87,2.56,-8.2,2.56,-8.2,4.63,-6.11,4.57,-6.11,5.87,-8.2,5.8,-8.2,6.44,-2.96,6.44,-2.93,2.04,-5.23,2.04,-5.23,0.17,-8.2,0.17]],["B1.5","mono",23,9,"g","g",[-5.18,-2.64],[-8.2,-4.63,-8.2,-1.32,-7.51,-1.32,-7.41,0.11,-4.67,0.11,-4.47,0.52,-3.17,0.4,-3.17,-1.23,-2.62,-1.23,-2.6,-2.05,-5.01,-1.92,-5.01,-3.59,-2.6,-3.51,-2.6,-5.88,-4.77,-5.88,-4.82,-6.21,-5.85,-4.47]],["C1.1","tri",49,13,"g","ge",[26.37,-2.87],[18.97,-4.47,18.97,-4.25,21.24,-4.18,21.24,-3.36,21.43,-3.8,21.43,0.4,23.31,0.4,23.31,-0.48,24.19,-0.5,23.42,-1.09,23.34,-1.81,23.67,-2.25,24.2,-2.41,24.96,-2.1,25.06,-1.81,24.99,-1.09,24.22,-0.5,25.12,-0.48,25.12,0.4,30.69,0.4,30.69,-3.9,30.4,-4.14,30.4,-5.22,30.12,-5.22,30.12,-6.44,25.64,-6.44,25.53,-4.47]],["C1.2","bi",31,0,"s","se",[27.03,3.46],[23.14,2.04,23.14,6.44,30.12,6.44,30.12,2.44,30.69,2.44,30.69,1.2,29.92,1.2,29.92,0.45,28.18,0.45,28.18,1.03,25.15,0.94,25.15,1.9]],["C1.3","bi",28,0,"s","s",[18.61,4.1],[14.35,6.44,22.58,6.44,22.6,2.04,18.3,2.04,18.3,2.46,17.3,2.46,17.3,2.08,15.14,2.08,15.14,2.83,14.37,2.83]],["C1.4","mono",24,0,"s","s",[11.84,3.66],[9.11,0.7,9.45,0.7,9.45,1.03,11.04,1.03,11.04,2.23,9.45,2.23,9.45,2.56,9.11,2.56,9.11,4.63,11.21,4.58,11.21,5.87,9.11,5.8,9.11,6.44,14.36,6.44,14.38,2.04,12.09,1.9,12.09,0.17,9.11,0.17]],["C1.5","mono",23,9,"g","g",[12.06,-2.7],[9.11,-1.32,9.81,-1.32,9.91,0.11,12.64,0.11,12.64,0.4,14.14,0.4,14.14,-1.23,14.69,-1.23,14.72,-2.05,12.3,-1.92,12.3,-3.59,14.72,-3.51,14.72,-5.88,12.55,-5.88,12.49,-6.21,11.47,-4.47,6.92,-4.47,9.11,-4.2]],["A2.1","mono",27,9,"g","g",[-11.32,-2.7],[-13.78,-6.43,-13.78,-3.65,-13.16,-3.65,-13.16,-1.48,-13.75,-1.48,-13.75,-1.12,-13.21,-1.12,-13.21,0.41,-8.97,0.41,-8.97,-1.21,-8.17,-1.21,-8.18,-2.77,-8.44,-2.17,-10.12,-2.17,-10.12,-3.37,-8.18,-3.33,-8.18,-4.35,-10.53,-4.46,-11.68,-6.43,-12.17,-6.43,-12.17,-6.15,-13.22,-6.15,-13.22,-6.43]],["A2.2","bi",34,5,"s","s",[-12.65,3.93],[-16.87,7.22,-13.75,7.33,-13.58,5.82,-8.17,5.82,-8.17,5.09,-10.48,5.15,-10.48,3.29,-8.17,3.33,-8.2,1.49,-8.97,1.49,-8.97,0.55,-10.55,0.55,-10.55,1.14,-11.73,1.14,-11.73,2.05,-16.29,2.05,-16.29,3.98,-16.87,3.98,-16.87,5.67,-16.6,5.07,-14.93,5.07,-14.93,6.27,-16.87,6.23]],["A2.3","bi",32,5,"s","s",[-20.88,4.41],[-25.34,5.82,-20.11,5.82,-20.11,7.22,-19.91,7.33,-16.83,7.22,-16.84,5.3,-17.11,6.12,-18.77,6.12,-18.77,4.92,-16.84,4.95,-16.86,2.85,-17.63,2.85,-17.63,2.1,-19.18,2.1,-19.18,2.61,-20.51,2.61,-20.51,2.05,-22.26,2.05,-22.26,2.66,-25.34,2.66]],["A2.4","mono",25,0,"s","s",[-27.93,3.35],[-30.69,3.45,-30.35,3.45,-30.35,3.78,-28.76,3.78,-28.76,4.98,-30.35,4.98,-30.35,5.31,-30.69,5.31,-30.69,6.45,-25.33,6.45,-25.33,6.01,-26.21,6.01,-26.21,5.75,-26.97,5.94,-27.39,5.37,-26.97,4.8,-26.21,4.99,-25.33,4.85,-25.33,4.42,-25.95,4.42,-25.95,2.17,-25.33,2.17,-25.19,1.8,-25.33,0.37,-29.92,0.46,-29.92,2.54,-30.69,2.54]],["A2.5","tri",45,10,"g","g",[-25.25,-2.21],[-30.35,-3.04,-30.35,-2.46,-28.76,-2.46,-28.76,-1.26,-30.35,-1.26,-30.35,-0.72,-30.11,-0.72,-30.11,0.41,-21.31,0.36,-21.31,-0.3,-20.69,-0.3,-20.69,-1.16,-19.92,-1.16,-19.92,-1.98,-22.42,-1.88,-22.42,-3.52,-19.92,-3.44,-19.92,-4.35,-22.26,-4.46,-23.34,-6.3,-23.34,-5.82,-24.89,-5.82,-24.89,-4.35,-29.94,-4.27,-30.11,-3.04]],["B2.1","mono",27,9,"g","g",[6.01,-2.71],[3.54,-6.43,3.54,-3.65,4.16,-3.65,4.16,-1.48,3.56,-1.48,3.56,-1.12,4.11,-1.12,4.11,0.41,8.35,0.41,8.35,-1.21,9.14,-1.21,9.14,-2.98,8.87,-2.17,7.2,-2.17,7.2,-3.37,9.14,-3.33,9.13,-4.46,6.79,-4.46,5.64,-6.43,5.14,-6.43,5.14,-6.15,4.1,-6.15,4.1,-6.43]],["B2.2","mono",28,3,"s","s",[6.51,4.29],[3.88,6.45,5.72,6.57,5.72,7.86,6.05,8.25,10.94,8.25,10.94,8.08,9.14,7.99,9.14,7.53,8.6,7.53,8.6,7.26,8.11,7.68,6.59,7.68,6.59,6.25,8.49,6.36,8.49,3.2,9.14,3.2,9.14,0.46,8.37,0.46,8.37,0.79,8.03,0.79,8.03,2.33,6.79,2.33,6.79,0.79,6.46,0.79,6.46,0.46,5.59,0.46,5.59,2.05,3.85,2.05]],["B2.3","mono",22,8,"s","s",[0.43,4.21],[-2.95,6.45,3.89,6.45,3.89,5.97,3.55,5.97,3.55,5.64,1.97,5.64,1.97,4.44,3.55,4.44,3.55,4.11,3.89,4.11,3.89,3.62,3.09,3.62,3.09,2.1,-2.3,2.05,-2.3,4.49,-2.95,4.49,-2.95,4.99,-2.66,4.99,-2.66,6.0,-2.95,6.0]],["B2.4","mono",28,3,"s","s",[-5.51,4.28],[-7.84,8.14,-5.1,8.25,-4.78,7.86,-4.78,6.57,-1.08,6.57,-2.94,6.29,-2.91,2.05,-4.66,2.05,-4.66,0.46,-5.48,0.46,-5.48,0.79,-5.82,0.79,-5.82,2.33,-7.06,2.33,-7.06,0.79,-7.39,0.79,-7.39,0.46,-8.21,0.46,-8.21,3.2,-7.56,3.2,-7.56,5.52,-7.84,5.52,-7.84,6.38,-6.72,6.38,-5.65,6.82,-5.65,7.63,-7.84,7.55]],["B2.5","mono",27,9,"g","g",[-5.1,-2.76],[-8.21,-1.21,-7.42,-1.21,-7.42,0.41,-3.18,0.41,-3.18,-1.12,-2.63,-1.12,-2.63,-1.48,-3.23,-1.48,-3.23,-3.65,-2.6,-3.65,-2.6,-6.43,-3.17,-6.43,-3.17,-6.15,-4.21,-6.15,-4.21,-6.43,-4.71,-6.43,-5.05,-5.77,-5.5,-5.94,-6.27,-4.46,-8.21,-4.46]],["C2.1","tri",47,13,"g","ge",[26.41,-2.92],[21.19,-4.35,21.48,0.41,23.3,0.41,23.3,-0.46,23.81,-0.49,23.37,-1.0,23.33,-1.62,23.66,-2.06,24.2,-2.23,24.7,-2.09,25.06,-1.62,25.02,-1.0,24.59,-0.49,25.12,-0.46,25.12,0.41,25.82,0.41,25.82,-0.37,27.61,-0.37,27.61,0.41,30.68,0.41,30.68,-3.85,30.4,-4.11,30.4,-5.21,30.11,-5.21,30.11,-6.43,25.64,-6.43,25.64,-4.46]],["C2.2","bi",42,4,"s","se",[26.46,3.47],[23.14,8.14,26.11,8.14,26.11,4.17,27.13,4.17,27.13,6.45,28.78,6.45,28.89,3.89,30.69,3.89,30.77,3.7,30.8,0.45,29.84,0.37,29.84,0.65,28.8,0.65,28.8,0.37,23.14,0.37]],["C2.3","bi",33,11,"s","s",[18.83,4.33],[14.35,4.62,16.28,4.46,16.28,5.66,14.59,5.66,14.35,5.46,14.35,6.45,14.69,6.57,22.29,6.57,22.53,6.45,22.6,2.05,18.29,2.05,18.29,2.47,17.29,2.47,17.29,2.1,15.14,2.1,15.14,3.71,14.35,3.71]],["C2.4","mono",28,3,"s","s",[11.79,4.27],[9.11,8.14,12.42,8.14,12.53,6.57,16.21,6.57,14.36,6.29,14.39,2.05,12.66,2.05,12.66,0.46,11.79,0.46,11.79,0.79,11.46,0.79,11.46,2.33,10.22,2.33,10.22,0.79,9.88,0.79,9.88,0.46,9.11,0.46,9.11,3.2,9.75,3.2,9.75,5.9,9.11,5.9,9.11,6.36,11.66,6.25,11.66,7.68,9.11,7.53]],["C2.5","mono",27,9,"g","g",[12.22,-2.71],[9.11,-1.21,9.9,-1.21,9.9,0.41,14.14,0.41,14.14,-1.12,14.68,-1.12,14.68,-1.48,14.09,-1.48,14.09,-3.65,14.71,-3.65,14.71,-6.43,14.15,-6.43,14.15,-6.15,13.1,-6.15,13.1,-6.43,12.61,-6.43,11.46,-4.46,9.11,-4.62]],["A3.1","mono",26,9,"g","g",[-11.32,-2.68],[-13.21,-6.43,-13.78,-6.43,-13.78,-3.65,-13.15,-3.65,-13.15,-1.48,-13.75,-1.48,-13.75,-1.13,-13.2,-1.13,-13.2,0.4,-8.96,0.4,-8.96,-1.21,-8.17,-1.21,-8.17,-2.77,-8.44,-2.17,-10.11,-2.17,-10.11,-3.37,-8.17,-3.33,-8.17,-4.35,-10.47,-4.35,-11.67,-6.43,-12.17,-6.43,-12.17,-6.15,-13.21,-6.15]],["A3.2","bi",34,5,"s","s",[-12.7,3.91],[-16.86,7.22,-13.74,7.33,-13.58,5.81,-8.17,5.81,-8.17,5.09,-10.48,5.15,-10.48,3.28,-8.17,3.32,-8.2,1.49,-8.96,1.49,-8.96,0.55,-10.55,0.55,-10.55,1.13,-11.73,1.13,-11.73,2.04,-16.29,2.04,-16.29,3.98,-16.87,3.98]],["A3.3","bi",32,5,"s","s",[-20.84,4.39],[-22.26,2.04,-22.26,2.65,-25.33,2.65,-25.33,5.81,-20.11,5.81,-20.11,7.22,-19.9,7.34,-16.83,7.22,-16.85,2.84,-17.62,2.84,-17.62,2.09,-19.17,2.09,-19.17,2.61,-20.5,2.61,-20.5,2.04]],["A3.4","mono",25,0,"s","s",[-27.93,3.34],[-30.68,3.44,-30.35,3.44,-30.35,3.77,-28.76,3.77,-28.76,4.97,-30.35,4.97,-30.35,5.3,-30.68,5.3,-30.68,6.45,-25.32,6.45,-25.32,6.0,-26.21,6.0,-26.21,5.75,-26.96,5.94,-27.39,5.37,-26.96,4.8,-26.21,4.99,-25.32,4.84,-25.32,4.42,-25.95,4.42,-25.95,2.16,-25.32,2.16,-25.18,1.8,-25.32,0.36,-29.91,0.45,-29.91,2.54,-30.68,2.54]],["A3.5","tri",44,10,"g","g",[-25.25,-2.19],[-30.35,-2.46,-28.76,-2.46,-28.76,-1.26,-30.35,-1.26,-30.35,-0.72,-30.11,-0.72,-30.11,0.4,-21.31,0.36,-21.31,-0.3,-20.69,-0.3,-20.69,-1.17,-19.92,-1.17,-19.92,-1.98,-22.41,-1.88,-22.41,-3.53,-19.92,-3.45,-19.92,-4.35,-22.2,-4.36,-23.34,-6.31,-23.34,-5.83,-24.89,-5.83,-24.89,-4.35,-26.32,-4.17,-29.94,-4.28,-30.11,-3.04,-30.35,-3.04]],["B3.1","mono",26,9,"g","g",[6.0,-2.68],[4.1,-6.43,3.54,-6.43,3.54,-3.65,4.16,-3.65,4.16,-1.48,3.57,-1.48,3.57,-1.13,4.11,-1.13,4.11,0.4,8.35,0.4,8.35,-1.21,9.15,-1.21,9.14,-2.77,8.88,-2.17,7.2,-2.17,7.2,-3.37,9.14,-3.33,9.14,-4.35,6.85,-4.35,5.64,-6.43,5.15,-6.43,5.15,-6.15,4.1,-6.15]],["B3.2","mono",25,3,"s","s",[6.44,3.92],[3.85,2.04,3.88,6.45,5.72,6.45,5.72,7.14,8.82,6.25,9.14,6.36,9.14,5.89,8.6,5.89,8.5,5.42,8.5,3.19,9.14,3.19,9.14,0.45,8.37,0.45,8.37,0.78,8.03,0.78,8.03,2.33,6.8,2.33,6.8,0.78,6.46,0.78,6.46,0.45,5.59,0.45,5.59,2.04]],["B3.3","mono",21,8,"s","s",[0.43,4.14],[-2.94,4.98,-2.65,4.98,-2.65,6.0,-2.94,6.0,-2.94,6.45,3.89,6.45,3.89,5.96,3.55,5.96,3.55,5.63,1.97,5.63,1.97,4.43,3.55,4.43,3.55,4.1,3.89,4.1,3.89,3.62,3.1,3.62,3.1,2.09,-2.29,2.04,-2.29,4.48,-2.94,4.48]],["B3.4","mono",27,3,"s","s",[-5.54,4.17],[-7.84,8.14,-5.09,8.25,-4.89,8.14,-4.89,6.45,-2.93,6.45,-2.91,2.04,-4.65,2.04,-4.65,0.45,-5.48,0.45,-5.48,0.78,-5.82,0.78,-5.82,2.33,-7.05,2.33,-7.05,0.78,-7.39,0.78,-7.39,0.45,-8.21,0.45,-8.21,3.19,-7.56,3.19,-7.56,5.42,-7.84,5.51,-7.84,6.38,-5.65,6.28,-5.65,7.63,-7.48,7.54,-7.65,6.98]],["B3.5","mono",27,9,"g","g",[-5.09,-2.74],[-8.2,-1.21,-7.41,-1.21,-7.41,0.4,-3.18,0.4,-3.18,-1.13,-2.63,-1.13,-2.63,-1.48,-3.22,-1.48,-3.22,-3.65,-2.6,-3.65,-2.6,-6.43,-3.16,-6.43,-3.16,-6.15,-4.21,-6.15,-4.21,-6.43,-4.71,-6.43,-5.07,-5.73,-5.5,-5.94,-6.32,-4.35,-8.13,-4.35,-8.21,-4.62]],["C3.1","tri",46,13,"g","ge",[26.42,-2.9],[21.19,-2.03,21.48,-2.03,21.48,0.4,23.31,0.4,23.31,-0.47,23.81,-0.49,23.37,-1.0,23.34,-1.63,23.66,-2.07,24.2,-2.24,24.68,-2.11,25.06,-1.63,25.03,-1.0,24.59,-0.49,25.12,-0.47,25.12,0.4,25.82,0.4,25.82,-0.37,27.61,-0.37,27.61,0.4,30.69,0.4,30.69,-3.86,30.4,-4.12,30.4,-5.22,30.11,-5.22,30.11,-6.43,25.64,-6.43,25.64,-4.35,21.19,-4.35]],["C3.2","bi",42,4,"s","se",[26.44,3.44],[23.14,8.14,26.11,8.14,26.11,4.16,27.13,4.16,27.13,6.45,28.78,6.45,28.78,3.88,30.7,3.88,30.77,3.69,30.69,0.36,29.84,0.36,29.84,0.64,28.8,0.64,28.8,0.36,23.14,0.36]],["C3.3","bi",32,11,"s","s",[18.84,4.27],[14.36,4.62,16.29,4.45,16.29,5.65,14.6,5.65,14.35,5.46,14.35,6.45,22.53,6.45,22.6,2.04,18.29,2.04,18.29,2.47,17.3,2.47,17.3,2.09,15.15,2.09,15.15,3.71,14.35,3.71]],["C3.4","mono",27,3,"s","s",[11.75,4.18],[9.11,6.36,11.66,6.24,11.66,7.68,10.14,7.68,9.81,7.52,9.64,6.98,9.64,7.52,9.11,7.52,9.11,8.14,9.64,8.25,12.2,8.25,12.42,8.14,12.42,6.45,14.37,6.45,14.39,2.04,12.67,2.04,12.67,0.45,11.79,0.45,11.79,0.78,11.46,0.78,11.46,2.33,10.22,2.33,10.22,0.78,9.88,0.78,9.88,0.45,9.11,0.45,9.11,3.19,9.76,3.19,9.64,5.89,9.11,5.89]],["C3.5","mono",26,9,"g","g",[12.24,-2.67],[9.11,-1.21,9.9,-1.21,9.9,0.4,14.14,0.4,14.14,-1.13,14.69,-1.13,14.69,-1.48,14.09,-1.48,14.09,-3.65,14.72,-3.65,14.72,-6.43,14.15,-6.43,14.15,-6.15,13.11,-6.15,13.11,-6.43,12.61,-6.43,11.53,-4.35,9.18,-4.35,9.11,-4.62]],["A4.1","mono",26,9,"g","g",[-11.32,-2.68],[-13.21,-6.43,-13.78,-6.43,-13.78,-3.65,-13.16,-3.65,-13.16,-1.48,-13.75,-1.48,-13.75,-1.12,-13.2,-1.12,-13.2,0.41,-8.96,0.41,-8.96,-1.21,-8.17,-1.21,-8.18,-2.77,-8.44,-2.17,-10.11,-2.17,-10.11,-3.37,-8.18,-3.33,-8.17,-4.35,-10.47,-4.35,-11.67,-6.43,-12.17,-6.43,-12.17,-6.15,-13.21,-6.15]],["A4.2","bi",34,5,"s","s",[-12.7,3.91],[-16.86,7.22,-13.74,7.33,-13.58,5.82,-8.17,5.82,-8.17,5.09,-10.48,5.15,-10.48,3.28,-8.17,3.33,-8.2,1.49,-8.96,1.49,-8.96,0.55,-10.55,0.55,-10.55,1.14,-11.73,1.14,-11.73,2.05,-16.29,2.05,-16.29,3.98,-16.87,3.98]],["A4.3","bi",32,5,"s","s",[-20.84,4.39],[-22.26,2.05,-22.26,2.66,-25.34,2.66,-25.34,5.82,-20.11,5.82,-20.11,7.22,-19.91,7.33,-16.83,7.22,-16.85,2.84,-17.62,2.84,-17.62,2.09,-19.17,2.09,-19.17,2.61,-20.5,2.61,-20.5,2.05]],["A4.4","mono",25,0,"s","s",[-27.93,3.35],[-30.68,3.45,-30.35,3.45,-30.35,3.78,-28.76,3.78,-28.76,4.98,-30.35,4.98,-30.35,5.31,-30.68,5.31,-30.68,6.45,-25.32,6.45,-25.32,6.01,-26.21,6.01,-26.21,5.75,-26.97,5.94,-27.39,5.37,-26.97,4.8,-26.21,4.99,-25.32,4.84,-25.32,4.42,-25.95,4.42,-25.95,2.17,-25.32,2.17,-25.19,1.8,-25.32,0.37,-29.91,0.46,-29.91,2.54,-30.68,2.54]],["A4.5","tri",44,10,"g","g",[-25.25,-2.19],[-30.35,-2.46,-28.76,-2.46,-28.76,-1.26,-30.35,-1.26,-30.35,-0.72,-30.11,-0.72,-30.11,0.41,-21.31,0.36,-21.31,-0.3,-20.69,-0.3,-20.69,-1.16,-19.92,-1.16,-19.92,-1.98,-22.42,-1.88,-22.42,-3.52,-19.92,-3.44,-19.92,-4.35,-22.2,-4.35,-23.34,-6.31,-23.34,-5.82,-24.89,-5.82,-24.89,-4.35,-26.32,-4.16,-29.94,-4.27,-30.11,-3.04,-30.35,-3.04]],["B4.1","mono",26,9,"g","g",[6.0,-2.68],[4.1,-6.43,3.54,-6.43,3.54,-3.65,4.16,-3.65,4.16,-1.48,3.57,-1.48,3.57,-1.12,4.11,-1.12,4.11,0.41,8.35,0.41,8.35,-1.21,9.14,-1.21,9.14,-2.77,8.87,-2.17,7.2,-2.17,7.2,-3.37,9.14,-3.33,9.14,-4.35,6.85,-4.35,5.64,-6.43,5.15,-6.43,5.15,-6.15,4.1,-6.15]],["B4.2","mono",25,3,"s","s",[6.44,3.93],[3.85,2.05,3.88,6.45,5.72,6.45,5.72,7.14,8.82,6.25,9.14,6.36,9.14,5.9,8.6,5.9,8.5,5.42,8.5,3.2,9.14,3.2,9.14,0.46,8.37,0.46,8.37,0.79,8.03,0.79,8.03,2.33,6.79,2.33,6.79,0.79,6.46,0.79,6.46,0.46,5.59,0.46,5.59,2.05]],["B4.3","mono",21,8,"s","s",[0.43,4.14],[-2.94,4.99,-2.66,4.99,-2.66,6.0,-2.94,6.0,-2.94,6.45,3.89,6.45,3.89,5.97,3.55,5.97,3.55,5.64,1.97,5.64,1.97,4.44,3.55,4.44,3.55,4.11,3.89,4.11,3.89,3.62,3.1,3.62,3.1,2.09,-2.3,2.05,-2.3,4.49,-2.94,4.49]],["B4.4","mono",27,3,"s","s",[-5.54,4.17],[-7.84,8.14,-5.1,8.25,-4.89,8.14,-4.89,6.45,-2.93,6.45,-2.91,2.05,-4.65,2.05,-4.65,0.46,-5.48,0.46,-5.48,0.79,-5.82,0.79,-5.82,2.33,-7.06,2.33,-7.06,0.79,-7.39,0.79,-7.39,0.46,-8.21,0.46,-8.21,3.2,-7.56,3.2,-7.56,5.42,-7.84,5.52,-7.84,6.38,-5.65,6.29,-5.65,7.63,-7.48,7.55,-7.65,6.97]],["B4.5","mono",27,9,"g","g",[-5.09,-2.74],[-8.2,-1.21,-7.41,-1.21,-7.41,0.41,-3.18,0.41,-3.18,-1.12,-2.63,-1.12,-2.63,-1.48,-3.23,-1.48,-3.23,-3.65,-2.6,-3.65,-2.6,-6.43,-3.17,-6.43,-3.17,-6.15,-4.21,-6.15,-4.21,-6.43,-4.71,-6.43,-5.07,-5.72,-5.5,-5.94,-6.32,-4.35,-8.16,-4.35,-8.21,-4.62]],["C4.1","tri",46,13,"g","ge",[26.42,-2.89],[21.19,-2.03,21.48,-2.03,21.48,0.41,23.31,0.41,23.31,-0.47,23.81,-0.49,23.37,-1.0,23.34,-1.63,23.66,-2.07,24.2,-2.23,24.68,-2.1,25.06,-1.63,25.03,-1.0,24.59,-0.49,25.12,-0.47,25.12,0.41,25.82,0.41,25.82,-0.37,27.61,-0.37,27.61,0.41,30.69,0.41,30.69,-3.85,30.4,-4.11,30.4,-5.21,30.11,-5.21,30.11,-6.43,25.64,-6.43,25.64,-4.35,21.19,-4.35]],["C4.2","bi",42,4,"s","se",[26.44,3.45],[23.14,8.14,26.11,8.14,26.11,4.17,27.13,4.17,27.13,6.45,28.78,6.45,28.78,3.88,30.7,3.88,30.77,3.7,30.69,0.37,29.84,0.37,29.84,0.65,28.8,0.65,28.8,0.37,23.14,0.37]],["C4.3","bi",32,11,"s","s",[18.84,4.28],[14.36,4.62,16.29,4.45,16.29,5.65,14.59,5.65,14.35,5.46,14.35,6.45,22.53,6.45,22.6,2.05,18.29,2.05,18.29,2.47,17.3,2.47,17.3,2.09,15.15,2.09,15.15,3.71,14.35,3.71]],["C4.4","mono",27,3,"s","s",[11.75,4.19],[9.11,6.36,11.66,6.25,11.66,7.68,10.14,7.68,9.81,7.53,9.64,6.97,9.64,7.53,9.11,7.53,9.11,8.14,9.64,8.25,12.2,8.25,12.42,8.14,12.42,6.45,14.37,6.45,14.39,2.05,12.66,2.05,12.66,0.46,11.79,0.46,11.79,0.79,11.46,0.79,11.46,2.33,10.22,2.33,10.22,0.79,9.88,0.79,9.88,0.46,9.11,0.46,9.11,3.2,9.76,3.2,9.76,5.42,9.64,5.82,9.11,5.93]],["C4.5","mono",26,9,"g","g",[12.24,-2.67],[9.11,-1.21,9.9,-1.21,9.9,0.41,14.14,0.41,14.14,-1.12,14.69,-1.12,14.69,-1.48,14.09,-1.48,14.09,-3.65,14.71,-3.65,14.71,-6.43,14.15,-6.43,14.15,-6.15,13.11,-6.15,13.11,-6.43,12.61,-6.43,11.53,-4.35,9.16,-4.35,9.11,-4.62]],["A5.1","bi",30,0,"s","s",[-12.76,4.32],[-16.25,2.04,-16.3,6.55,-8.82,6.44,-9.04,2.13,-11.61,2.13,-11.61,2.37,-12.61,2.37,-12.61,2.04]],["A5.2","bi",31,0,"s","s",[-21.41,4.43],[-25.33,6.44,-16.91,6.44,-16.91,5.47,-17.49,5.47,-17.7,2.08,-20.19,2.08,-20.19,2.46,-21.19,2.46,-21.19,2.04,-22.83,2.04,-22.83,2.65,-25.33,2.65]],["A5.3","mono",25,0,"s","s",[-27.92,3.33],[-30.68,3.44,-30.34,3.44,-30.34,3.77,-28.76,3.77,-28.76,4.97,-30.34,4.97,-30.34,5.29,-30.68,5.29,-30.68,6.44,-25.32,6.44,-25.32,6.0,-26.2,6.0,-26.2,5.74,-26.96,5.93,-27.39,5.36,-26.89,4.77,-26.2,4.98,-25.32,4.83,-25.32,4.41,-25.94,4.41,-25.94,2.15,-25.32,2.15,-25.18,1.79,-25.32,0.35,-29.91,0.45,-29.91,2.53,-30.68,2.53]],["A5.4","tri",44,15,"g","g",[-25.26,-2.2],[-30.34,-2.47,-28.76,-2.47,-28.76,-1.27,-30.34,-1.27,-30.34,-0.73,-30.1,-0.73,-30.1,0.4,-21.31,0.35,-21.31,-0.31,-20.68,-0.31,-20.68,-1.17,-19.91,-1.17,-19.91,-1.99,-22.41,-1.89,-22.41,-3.54,-19.91,-3.45,-19.91,-4.36,-22.2,-4.36,-23.34,-6.31,-23.34,-5.83,-24.88,-5.83,-24.88,-4.36,-26.31,-4.17,-29.93,-4.29,-30.1,-3.05,-30.34,-3.05]],["B5.1","lux",100,39,"f","sg",[7.35,0.85],[0.46,3.9,0.74,3.9,0.74,4.91,0.46,4.91,0.46,6.44,9.22,6.44,9.22,1.42,10.91,1.42,10.91,2.03,13.95,2.03,14.14,-1.18,14.72,-1.18,14.72,-1.83,14.38,-1.83,14.38,-2.16,12.8,-2.16,12.8,-3.36,14.38,-3.36,14.38,-3.69,14.72,-3.69,14.72,-4.36,8.25,-4.36,8.25,-3.61,6.89,-3.61,6.89,-4.36,3.54,-4.36,3.54,-3.59,3.88,-3.59,3.88,-2.36,3.54,-2.51,3.41,2.04,0.46,2.04]],["B5.2","lux",100,39,"f","sg",[-6.41,0.85],[-13.77,-3.69,-13.44,-3.69,-13.44,-3.36,-11.85,-3.36,-11.85,-2.16,-13.44,-2.16,-13.44,-1.83,-13.77,-1.83,-13.77,-1.18,-13.2,-1.18,-13.01,2.06,-9.96,2.06,-9.96,1.45,-8.28,1.45,-8.28,6.44,0.49,6.44,0.49,4.91,0.2,4.91,0.2,3.9,0.49,3.9,0.49,2.04,-2.6,2.04,-2.6,-2.5,-2.93,-2.37,-2.93,-3.59,-2.6,-3.59,-2.6,-4.36,-5.95,-4.36,-5.95,-3.61,-7.31,-3.61,-7.31,-4.36,-13.48,-4.47,-13.77,-4.36]],["C5.1","lux",72,24,"f","sge",[26.51,-0.96],[20.86,2.06,22.5,2.06,22.5,0.4,23.62,0.4,23.62,1.42,27.01,1.43,27.01,3.89,26.53,3.89,26.53,5.5,28.37,5.5,28.41,5.78,27.29,6.1,27.29,6.44,28.78,6.44,28.9,3.87,31.16,3.97,30.69,1.53,30.81,-2.33,30.69,-2.77,29.92,-2.77,29.92,-4.18,30.59,-4.18,30.41,-5.02,30.69,-5.02,30.69,-5.33,30.12,-5.33,30.12,-6.44,25.64,-6.44,25.64,-5.86,26.12,-5.86,26.12,-4.75,25.64,-4.75,25.64,-4.36,20.86,-4.36]],["C5.2","bi",31,15,"s","s",[21.72,4.39],[17.77,2.04,17.77,4.61,18.06,4.61,17.77,6.44,25.9,6.55,25.67,2.11,23.29,2.11,23.29,2.44,22.12,2.44,22.12,2.65,19.22,2.65,19.22,2.04]],["C5.3","bi",28,15,"s","s",[13.59,4.33],[9.19,2.73,9.19,6.44,16.25,6.44,16.25,5.69,17.71,5.69,17.78,2.69,16.25,2.69,16.25,2.04,14.53,2.04,14.53,2.65]],["A6.1","lux",120,26,"p","sg",[-10.95,-0.56],[-19.7,0.54,-19.7,4.59,-11.39,4.7,-11.39,6.46,-11.2,6.73,-8.74,6.73,-8.74,6.45,-8.11,6.45,-8.11,-0.85,-3.17,-0.99,-3.17,-2.75,-2.59,-2.75,-2.59,-3.34,-2.93,-3.34,-2.93,-3.67,-4.51,-3.67,-4.51,-4.87,-2.93,-4.87,-2.93,-5.2,-2.48,-5.2,-2.48,-6.29,-2.89,-6.54,-10.86,-6.63,-16.75,-6.43,-16.75,-5.55,-15.98,-5.55,-15.98,-4.61,-13.77,-4.61,-13.77,-2.56,-13.0,-2.56,-13.0,0.54,-13.45,0.54,-13.45,0.72]],["A6.2","lux",100,22,"p","sg",[-24.95,0.37],[-30.67,3.72,-30.05,3.72,-29.98,6.56,-25.99,6.56,-25.97,4.59,-19.91,4.59,-19.91,3.07,-20.2,3.07,-20.2,2.06,-19.91,2.06,-19.91,-4.26,-20.18,-3.66,-21.85,-3.66,-21.85,-4.86,-19.91,-4.82,-19.91,-6.43,-25.5,-6.43,-25.5,-4.63,-24.84,-5.29,-24.84,-4.86,-23.58,-4.86,-23.58,-3.66,-24.84,-3.66,-24.84,-3.45,-25.5,-3.78,-25.5,-2.92,-30.67,-2.8,-30.67,0.12,-30.1,0.12,-30.1,2.02,-30.67,2.02]],["B6.1","bi",33,16,"s","s",[2.93,2.38],[-1.88,4.05,-1.83,5.06,-0.09,5.06,-0.04,4.31,1.01,4.31,1.05,5.06,2.79,5.06,2.84,4.59,3.89,4.59,3.94,5.06,5.68,5.06,5.73,4.59,6.74,4.59,6.74,1.1,5.94,1.1,5.94,-1.06,3.55,-1.06,3.55,0.54,-0.67,0.54,-0.67,2.05,-1.88,2.05,-1.88,2.59,0.76,2.68,0.76,3.93]],["B6.2","bi",28,6,"s","s",[-5.39,2.87],[-8.15,3.97,-7.81,3.97,-7.81,4.29,-6.22,4.29,-6.22,5.5,-7.81,5.5,-7.81,5.82,-8.15,5.82,-8.15,6.45,-7.59,6.45,-7.59,6.73,-5.13,6.73,-4.94,6.47,-4.94,5.06,-2.97,5.06,-2.92,4.59,-1.84,4.59,-1.84,4.05,-4.36,4.14,-4.36,2.53,-1.84,2.59,-1.84,2.05,-2.22,2.05,-2.22,0.74,-2.59,0.54,-2.59,0.16,-6.02,0.16,-6.02,-0.45,-7.28,-0.45,-7.28,0.49,-8.05,0.49,-8.05,2.0,-7.57,2.0,-7.57,3.43,-8.15,3.43]],["C6.1","lux",94,41,"p","sg",[24.48,0.06],[18.42,2.66,18.53,6.73,21.0,6.73,21.19,6.46,21.19,4.59,25.91,4.7,26.0,4.31,27.05,4.31,27.05,5.04,29.26,5.04,29.26,0.49,28.79,0.49,28.79,-6.43,28.14,-6.43,28.14,-6.1,27.81,-6.1,27.81,-4.56,26.57,-4.56,26.57,-6.1,26.23,-6.1,26.23,-6.43,20.86,-6.43,20.86,-5.88,21.2,-5.88,21.2,-5.56,22.79,-5.56,22.79,-4.36,21.2,-4.36,21.2,-4.03,20.86,-4.03,20.86,-3.24,21.44,-3.24,21.63,0.47,20.73,0.65,20.73,2.66]],["C6.2","lux",98,28,"p","sg",[10.93,-0.54],[3.55,-3.54,3.88,-3.54,3.88,-3.21,5.47,-3.21,5.47,-2.01,3.88,-2.01,3.88,-1.68,3.55,-1.68,3.55,-1.11,7.5,-1.11,7.5,0.3,6.7,0.3,6.7,1.81,7.78,1.81,7.78,1.47,10.15,1.47,10.15,1.96,10.96,1.96,10.96,3.43,10.15,3.43,10.15,3.77,6.7,3.58,6.82,5.06,14.4,5.06,14.59,6.73,17.06,6.73,17.16,2.66,14.73,2.66,14.73,0.3,14.15,0.3,14.15,-2.82,14.73,-2.82,14.73,-6.43,6.52,-6.43,6.52,-4.35,3.55,-4.35]]];
    const units = KP.map((r) => {
      const code = r[0], f = Number(code.charAt(1)), xs = r[7].filter((v, i) => i % 2 === 0);
      const h2 = hash(code + '#');
      const extKey = r[3] > 0 ? (f >= 5 ? 'terrace' : 'loggia') : 'none';
      const rr = hash(code + 's4') % 100;
      const demoSt = rr < 55 ? 'disp' : rr < 73 ? 'res' : 'vend';
      const u = { code: code, f: f, n: Number(code.slice(3)), type: r[1], row: r[4], x0: Math.min.apply(null, xs), x1: Math.max.apply(null, xs), area: r[2], ext: r[3], extKey: extKey, demoSt: demoSt, faces: r[5].split(''), c: r[6], poly: r[7] };
      u.pick = () => self.pickUnit(code);
      return u;
    });
    const byCode = {}, byFloor = {};
    units.forEach((u) => { byCode[u.code] = u; (byFloor[u.f] = byFloor[u.f] || []).push(u); });
    const first = units.find((u) => u.code === 'C4.1' && u.demoSt === 'disp') || units.find((u) => u.f === 4 && u.type === 'tri' && u.demoSt === 'disp') || units[0];
    this._model = { units: units, byCode: byCode, byFloor: byFloor, defaultSel: first.code };
    return this._model;
  }

  st(u) { return this.P().demo ? u.demoSt : 'disp'; }

  lineOf(u) { return this.TY()[u.type].line; }

  priceOf(u) {
    const P = this.P();
    if (u.f === 6) return null;
    if (u.type === 'mono') return P.studio || null;
    if (u.type === 'bi') return P.q1 || null;
    if (u.type === 'tri') return P.q2 || null;
    return null;
  }

  matches(u, type, onlyAvail) {
    const okType = type === 'all' || this.TY()[u.type].group === type;
    return okType && (!onlyAvail || this.st(u) === 'disp');
  }

  // ---------- sun (NOAA approximation, Milan)
  MONTHS() { return { mar: { doy: 80, tz: 1 }, jun: { doy: 172, tz: 2 }, set: { doy: 264, tz: 2 }, dez: { doy: 355, tz: 1 } }; }

  sunAt(doy, hour, tz) {
    const D = Math.PI / 180, lat = 45.4369 * D, lon = 9.1995;
    const g = 2 * Math.PI / 365 * (doy - 1 + (hour - tz - 12) / 24);
    const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
    const eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
    const tst = hour * 60 + eqt + 4 * lon - 60 * tz;
    const ha = (tst / 4 - 180) * D;
    const el = Math.asin(Math.sin(lat) * Math.sin(decl) + Math.cos(lat) * Math.cos(decl) * Math.cos(ha)) / D;
    const az = (Math.atan2(Math.sin(ha), Math.cos(ha) * Math.sin(lat) - Math.tan(decl) * Math.cos(lat)) / D + 540) % 360;
    return { az: az, el: el };
  }

  dayInfo(mk) {
    this._days = this._days || {};
    if (this._days[mk]) return this._days[mk];
    const m = this.MONTHS()[mk];
    let rise = null, set = null, prev = this.sunAt(m.doy, 3, m.tz).el;
    const samples = [];
    for (let h = 3; h <= 23.75; h += 1 / 12) {
      const s = this.sunAt(m.doy, h, m.tz);
      if (prev < -0.833 && s.el >= -0.833) rise = h;
      if (prev >= -0.833 && s.el < -0.833) set = h;
      prev = s.el;
      samples.push({ h: h, az: s.az, el: s.el });
    }
    this._days[mk] = { rise: rise, set: set, samples: samples };
    return this._days[mk];
  }

  hhmm(h) { const m = Math.round(h * 60); return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }

  sunWindows(u, mk) {
    const P = this.P(), O = P.orient;
    const normals = { s: O, g: O + 180, e: O - 90, w: O + 90 };
    const day = this.dayInfo(mk);
    const runs = [];
    let cur = null;
    day.samples.forEach((s) => {
      const hit = s.el > 1 && u.faces.some((f) => {
        const d = Math.abs((((s.az - normals[f]) % 360) + 540) % 360 - 180);
        return d < 85;
      });
      if (hit && !cur) cur = { a: s.h, b: s.h };
      else if (hit) cur.b = s.h;
      else if (cur) { runs.push(cur); cur = null; }
    });
    if (cur) runs.push(cur);
    const total = runs.reduce((acc, r) => acc + (r.b - r.a), 0);
    return { runs: runs, total: total };
  }

  static GESTAO(code) {
    const D = {
      'pt-BR': { cEy: 'O conceito', cTitle: 'Um modelo residencial projetado para gerar valor, com a opção de uma gestão centralizada de', pillars: ['Apartamentos mobiliados', 'Espaços comuns', 'Serviços'], cLead: 'que garante',
        benefits: ['Alta atratividade', 'Baixa complexidade de gestão', 'Flexibilidade', 'Monitorar o estado dos imóveis', 'Adaptar a estratégia ao mercado', 'Controle de acesso', 'Alta ocupação', 'Manutenção contínua'],
        mEy: 'Gestão', mTitle: 'O empreendimento conta com uma opção de gestão centralizada, que pode ser escolhida pelo proprietário', mText: 'Um modelo que combina tecnologia e equipe profissional em um sistema de gestão projetado para otimizar o desempenho e proteger o imóvel ao longo do tempo.',
        mPoints: ['Adapta a estratégia locatícia ao mercado', 'Monitora o estado dos imóveis', 'Otimiza a taxa de ocupação ao longo do tempo', 'Fornece padrões de qualidade ao longo do tempo', 'Controla os acessos', 'Favorece baixa complexidade para a propriedade', 'Assegura manutenção contínua e programada', 'Gere serviços e espaços comuns'],
        sEy: 'Serviços', sTitle: 'Os serviços', sPoints: ['Elevam a experiência aos padrões da hotelaria', 'Asseguram níveis de qualidade ao longo do tempo', 'Otimizam a ocupação e os fluxos', 'Reduzem a complexidade operacional para o proprietário'],
        services: ['Gestão de propriedade & locação', 'Serviço de alimentos & bebidas', 'Manobrista', 'Serviço de limpeza & lavanderia', 'Concierge & gestão de acessos', 'Manutenção centralizada'],
        optTitle: 'A gestão é opcional', optText: 'Cada proprietário escolhe como administrar o seu imóvel:', opts: ['Aderir à gestão centralizada do empreendimento', 'Administrar o imóvel por conta própria', 'Terceirizar a outra administradora de sua escolha'],
        palTitle: 'O moodboard', palNote: 'Paleta dos apartamentos, com design assinado por um arquiteto de renome na Itália' },
      it: { cEy: 'Il concept', cTitle: 'Un modello residenziale pensato per generare valore, con la possibilità di una gestione centralizzata di', pillars: ['Appartamenti arredati', 'Spazi comuni', 'Servizi'], cLead: 'che garantisce',
        benefits: ['Alta attrattività', 'Bassa complessità di gestione', 'Flessibilità', 'Monitoraggio dello stato degli immobili', 'Strategia adattata al mercato', 'Controllo degli accessi', 'Alta occupazione', 'Manutenzione continua'],
        mEy: 'Gestione', mTitle: 'Il progetto prevede un’opzione di gestione centralizzata, a scelta del proprietario', mText: 'Un modello che unisce tecnologia e professionalità in un sistema di gestione pensato per ottimizzare il rendimento e tutelare l’immobile nel tempo.',
        mPoints: ['Adatta la strategia di locazione al mercato', 'Monitora lo stato degli immobili', 'Ottimizza il tasso di occupazione nel tempo', 'Garantisce standard di qualità nel tempo', 'Controlla gli accessi', 'Riduce la complessità per la proprietà', 'Assicura manutenzione continua e programmata', 'Gestisce servizi e spazi comuni'],
        sEy: 'Servizi', sTitle: 'I servizi', sPoints: ['Portano l’esperienza agli standard alberghieri', 'Assicurano livelli di qualità nel tempo', 'Ottimizzano occupazione e flussi', 'Riducono la complessità operativa per il proprietario'],
        services: ['Property & rental management', 'Servizio food & beverage', 'Valet parking', 'Pulizie & lavanderia', 'Concierge & gestione accessi', 'Manutenzione centralizzata'],
        optTitle: 'La gestione è facoltativa', optText: 'Ogni proprietario sceglie come amministrare il proprio immobile:', opts: ['Aderire alla gestione centralizzata del progetto', 'Gestire l’immobile in autonomia', 'Affidarlo a un altro gestore di sua scelta'],
        palTitle: 'Il moodboard', palNote: 'Palette degli appartamenti, design firmato da un architetto di fama in Italia' },
      en: { cEy: 'The concept', cTitle: 'A residential model designed to create value, with the option of centralised management of', pillars: ['Furnished apartments', 'Common spaces', 'Services'], cLead: 'which ensures',
        benefits: ['High appeal', 'Low management complexity', 'Flexibility', 'Monitoring of the properties', 'Strategy adapted to the market', 'Access control', 'High occupancy', 'Ongoing maintenance'],
        mEy: 'Management', mTitle: 'The development offers an optional centralised management service, which owners may choose', mText: 'A model combining technology and professionalism in a management system designed to optimise performance and protect the property over time.',
        mPoints: ['Adapts the rental strategy to the market', 'Monitors the condition of the properties', 'Optimises occupancy over time', 'Delivers quality standards over time', 'Controls access', 'Keeps complexity low for the owner', 'Ensures ongoing, scheduled maintenance', 'Runs services and common spaces'],
        sEy: 'Services', sTitle: 'The services', sPoints: ['Raise the experience to hospitality standards', 'Ensure quality levels over time', 'Optimise occupancy and flows', 'Reduce operating complexity for the owner'],
        services: ['Property & rental management', 'Food & beverage service', 'Valet parking', 'Cleaning & laundry', 'Concierge & access management', 'Centralised maintenance'],
        optTitle: 'Management is optional', optText: 'Each owner chooses how to run their property:', opts: ['Join the development’s centralised management', 'Manage the property themselves', 'Outsource to another manager of their choice'],
        palTitle: 'The moodboard', palNote: 'Apartment palette, designed by a renowned Italian architect' }
    };
    const o = Object.assign({}, D[code] || D['pt-BR']);
    const num = (a) => a.map((x, i) => ({ n: String(i + 1).padStart(2, '0'), text: x }));
    o.pillarsN = num(o.pillars); o.servicesN = num(o.services);
    o.palette = ['#BBB6AB', '#DDD9D0', '#482A1D', '#1D1D1D', '#D3CEC5'].map((hx) => ({ hex: hx, fg: /^#(48|1D)/.test(hx) ? '#F4EFE7' : '#2A1E17' }));
    return o;
  }
  static PLANS(code) {
    const L = ['Smart Living', 'Comfort Living', 'Exclusive Living', 'Luxury Living'];
    const D = {
      'pt-BR': { title: 'Plantas', tipo: 'Planta-tipo', note: 'Ilustrativa, sem escala. Layout mobiliado assinado por arquiteto de renome na Itália.', common: 'Plantas das áreas comuns', terreo: 'Térreo', roof: 'Rooftop', open: 'Ampliar planta',
        d: ['Unidade compacta em ambiente único. Alta rotatividade, orientada à maximização do rendimento.', 'Separação entre zona de estar e zona de dormir, com possível sofá-cama. Capacidade até 4 pessoas.', 'Unidade de dimensões mais generosas. Uso corporativo, relocation ou uso direto.', 'Para o máximo do conforto: maior amplitude, clientela internacional e permanências mais longas.'] },
      it: { title: 'Planimetrie', tipo: 'Pianta tipo', note: 'Indicativa, non in scala. Arredo firmato da un architetto di fama in Italia.', common: 'Planimetrie degli spazi comuni', terreo: 'Piano terra', roof: 'Rooftop', open: 'Ingrandisci la pianta',
        d: ['Unità compatta in ambiente unico. Alta rotazione, orientata alla massimizzazione del rendimento.', 'Zona giorno separata dalla zona notte, con possibile divano letto. Fino a 4 persone.', 'Unità dalle dimensioni più generose. Uso corporate, relocation o uso diretto.', 'Il massimo del comfort: più ampiezza, clientela internazionale e soggiorni più lunghi.'] },
      en: { title: 'Floor plans', tipo: 'Typical plan', note: 'Indicative, not to scale. Furnished layout by a renowned Italian architect.', common: 'Common area plans', terreo: 'Ground floor', roof: 'Rooftop', open: 'Enlarge plan',
        d: ['Compact single-space unit. High turnover, geared to maximising yield.', 'Living and sleeping areas separated, sofa bed possible. Sleeps up to 4.', 'More generous dimensions. Corporate use, relocation or owner use.', 'Maximum comfort: more space, international clientele and longer stays.'] }
    };
    const o = D[code] || D['pt-BR'];
    o.names = L.map((l) => o.tipo + ' · ' + l).concat([o.terreo, o.roof]);
    o.lines = L;
    return o;
  }
  MEDIA() {
    if (this._media) return this._media;
    const T = {"apt-brown-view06":"6547c1b8e22c4862867f12a218200b98","apt-chiara-view01":"68738a13aa144bdf93f747572487650f","apt-chiara-view02":"50e358764f7352cbcfc034636dec029e","apt-chiara-view04":"607c24dd42b892c3877a59120f30e53f","apt-chiara-view06":"30c900b10537f565c0e14bb5efc14841","cam-06":"1e864adf9a8942be563d57f5597635e2","co-working5":"ba2440d084bcf1a16bce2ad7e3f09ba4","ext-garden-fitness":"62b81befe31c662efe9fb2401064110c","ext-garden-lounge":"2e071a955f4dc0cc950225d1bd765f37","ext-rooftop-corner":"a60591c0fc9a44eff7822500bee1c397","ext-street-dusk":"b60008410008cae8878874ab7abc6a46","ext-street-elevation":"3072e1ed77a1c63636e913b8d629667c","fin-doccia":"bf6b105fed70fca07a95934d72ac2186","fin-gres":"8987a794b2f881e2c094c8b78530f60e","fin-lavabi":"a4f7aaf1af9163461ac9431bc29b2403","fin-legni":"98b6c46057f9fe86c823a16f6e7ad0ae","fin-palette":"1db39d4cadc4266c381299c6a168c06f","fin-parquet":"a3b6ebc253c0bfe6018c56c876083461","fin-porte":"7f233c07f01047b3ba4366ea77dc194d","fin-rubinetteria":"6a27fd51bf99f239e4427677a08fe93a","fin-sanitari":"b1e6a9423df314873bf80e667bba8843","fin-scaldasalviette":"23a150f7a1a1c77c2d8cc18307442e4b","fin-tessuti":"7cb8331a931e3a0d2f7bd5308dedd9be","ingresso-4":"b143839246a9fc1d0d1bb5166feb31d3","ingresso-5":"e7c94d049b29581106b78f7f1910e28e","ingresso-7":"8fca8d809dc5606b82378cef8db0157a","ingresso-8":"61ed938e0e082381a1cb584da6f41862","ingresso":"44133447cfcc0bd0ac93b62c63c2afaf","palestra-2":"504d50447ad226550f029504fbaba156","palestra-4":"2f4a2be2f856e244c6ef35da66d727a4","piscina--bar":"97cb31ee0a04b22e2ac0b6fd2315d9db","piscina":"d89515d8978082aa155eb5b694274abf","restorante-tif-2":"434e1fa9d82596cf85f915cc2561e460","restorante-tif-6":"56bf7b30960e3572d0f56cbb1def13dc","salotto-ingresso":"cbcf57ac9d2f003b077a564633964122","sociallounge-1":"6490d03698b17681fe91a4177e8f6751","sociallounge-a1":"c634218ef5b8b4ba3a7df93549177b9b","sociallounge-a2":"a73f27a950abf44dcdce2d14ef8105a3","sociallounge-render1":"fa944482a0e55944fb509bb8e5a367e1","socialloungelaunge-4":"e1bcfc3e257d5e676ec629d58a303c6f","tv-1cam":"8ea21e80dcc49e609824ec35a7fae8a7","yoga-2":"b24a9287e973b6ba3da05dc1fe607686","yoga-4":"799e2f5f45e390b6971d97ac21a537b9","yoga-6":"ccb6e27080ad9c335f0cfae02619b2da","yoga-9":"58e8f58db7c7811a7f418b22c22b7843"};
    const F = {"apt-brown-view06":"c9f829e8d9639feb296f2080ab815cd4","apt-chiara-view01":"62feca341880e63cdc7332e0bc711232","apt-chiara-view02":"f216fc67e0b0c44a6a6daffd9c70fc9a","apt-chiara-view04":"781d154b5242460f7beb104c8f68b2c5","apt-chiara-view06":"54143c2d01f47e97aab4544aa1f2029b","cam-06":"4ec36e5a29adc8ea8d5d00e47359c411","co-working5":"5b18d3f2249b2703202b09cc0642af1f","ext-garden-fitness":"b242c1cf20dd3a7442677cfd9fdfdc9e","ext-garden-lounge":"12e8e951c25ca993c9aa5a05fd9a36ea","ext-rooftop-corner":"125fa4129813b768aa852cdfa448f08e","ext-street-dusk":"a997c45a8bec6bc11916b5740301f3c7","ext-street-elevation":"f810cfee345cadb0dcdecd1adce7dcf6","ingresso-4":"ae14cda810fec9db0309e4151e36fdcc","ingresso-5":"22389378b3cc8003de8dba358efab0fa","ingresso-7":"9a1d6e46e2d98c43ecc390b0fd8cee2c","ingresso-8":"c4f72fd37ff9da68d10be10c9a52c88f","ingresso":"0fd0994988bfe727b8ba11ff732aae23","palestra-2":"f9060f0ee0088040d0eb4f7eff3e5590","palestra-4":"b43301932149c96642fad18653dcb1ab","piscina--bar":"a6b8066115735768477a6c90d2681243","piscina":"cdc48cb3b4a1946db0b66667bb63e108","restorante-tif-2":"0645be9b152708a30d543e2c28af4985","restorante-tif-6":"0de95e190f3940ffa6f2a50a0383ff9e","salotto-ingresso":"51852021ba686fccce0258ed4fcfd91b","sociallounge-1":"4ba79d403d8504906558a92e7dc31a66","sociallounge-a1":"d9b94a38b6b2b11c938057d113e80d23","sociallounge-a2":"a8c88dfb2f9cdea46a93ec4698a205ce","sociallounge-render1":"18d59da60e6f8f628e30500365ea2b90","socialloungelaunge-4":"0c0c6e82cf9176b125667dcad1373ba2","tv-1cam":"451f8f9a82f4a0dcfdb685e6f6a16743","yoga-2":"3e7a9e32a015f7a904653fc27d48a5c6","yoga-4":"6a625cc3315301ef56e35b2798e1b145","yoga-6":"64a88e5bf3a779e89cb015a6811fd51d","yoga-9":"77ceb3af188ea1caa4b6214d8b75f3fa"};
    const img = (k) => ({ t: '/_blob/' + T[k], f: '/_blob/' + (F[k] || T[k]) });
    const old = (id) => ({ t: '/_blob/' + id, f: '/_blob/' + id });
    const sets = {
      ext: ['ext-street-dusk', 'ext-street-elevation', 'ext-rooftop-corner', 'cam-06'].map(img).concat(['cbe44b78184861b39cac17d960f3db30', '8eba094fd895fef05a68d024d0305f43', '5324335dfffed861f67b03e5cdbac58c', '37d8623671ab1b6412670df7828e8acb'].map(old)),
      rooftop: ['piscina', 'piscina--bar', 'salotto-ingresso'].map(img),
      lobby: ['ingresso-8', 'ingresso-5', 'ingresso-4', 'ingresso-7', 'ingresso'].map(img),
      dining: ['restorante-tif-2', 'restorante-tif-6'].map(img),
      lounge: ['sociallounge-1', 'socialloungelaunge-4', 'sociallounge-a1', 'sociallounge-a2', 'sociallounge-render1'].map(img),
      work: ['co-working5', 'tv-1cam'].map(img),
      gym: ['palestra-4', 'palestra-2'].map(img),
      yoga: ['yoga-4', 'yoga-6', 'yoga-9', 'yoga-2'].map(img),
      garden: ['ext-garden-lounge', 'ext-garden-fitness'].map(img),
      chiara: ['apt-chiara-view02', 'apt-chiara-view01', 'apt-chiara-view04', 'apt-chiara-view06'].map(img),
      brown: ['apt-brown-view06'].map(img),
      plans: ['t1', 't2', 't3', 't4', 'terreo', 'rooftop'].map((k) => ({ t: 'assets/img/plan/plan-' + k + '.jpg', f: 'assets/img/plan/plan-' + k + '.jpg' })),
      real: ['ext-street-dusk', 'ext-street-elevation', 'ext-rooftop-corner', 'cam-06', 'ext-garden-lounge', 'ext-garden-fitness'].map(img)
    };
    const fin = ['fin-parquet', 'fin-gres', 'fin-sanitari', 'fin-lavabi', 'fin-doccia', 'fin-rubinetteria', 'fin-scaldasalviette', 'fin-porte', 'fin-palette'].map((k) => '/_blob/' + T[k]);
    this._media = { sets: sets, fin: fin, amen: ['rooftop', 'lobby', 'dining', 'lounge', 'work', 'gym', 'yoga', 'garden'] };
    return this._media;
  }

  pickUnit(code) {
    const s = this.S();
    this.setState({ sel: code, focus: s.iso === undefined || s.iso === null });
  }

  handlers() {
    if (this._h) return this._h;
    const set = (o) => this.setState(o);
    const M = this.model();
    const eng = () => this._eng;
    const h = { type: {}, floor: {}, g: [], lang: {} };
    ['all', 'mono', 'bi', 'tri', 'lux'].forEach((k) => { h.type[k] = () => set({ type: k }); });
    [1, 2, 3, 4, 5, 6].forEach((f) => { h.floor[f] = () => set({ iso: this.S().iso === f ? null : f, focus: false }); });
    ['pt', 'it', 'en'].forEach((l) => { h.lang[l] = () => set({ lang: l }); });
    h.allFloors = () => set({ iso: null, focus: false });
    h.exitFocus = () => set({ focus: false });
    h.toggleAvail = (e) => set({ onlyAvail: e && e.target ? !!e.target.checked : !this.S().onlyAvail });
    h.toggleMode = (e) => set({ mode: (e && e.target ? e.target.checked : this.S().mode !== 'status') ? 'status' : 'facade' });
    h.setMonth = (e) => { const v = e && e.target ? e.target.value : 'jun'; set({ month: this.MONTHS()[v] ? v : 'jun' }); };
    const stopPlay = () => { if (this._play) { clearInterval(this._play); this._play = null; } };
    h.setHour = (e) => {
      const v = Number(e && e.target ? e.target.value : 21);
      if (isNaN(v) || v === this.timeState().hour) return;
      if (this._play) { stopPlay(); set({ hour: v, playing: false }); } else set({ hour: v });
    };
    h.togglePlay = () => {
      if (this._play) { stopPlay(); set({ playing: false }); return; }
      const tm = this.timeState(), day = this.dayInfo(tm.month);
      const endOf = () => Math.min(23.5, Math.ceil((this.dayInfo(this.timeState().month).set + 1.25) * 4) / 4);
      let hr = tm.hour;
      if (hr >= day.set - 0.25 || hr < day.rise - 1) hr = Math.max(4.5, Math.floor((day.rise - 0.5) * 4) / 4);
      const s0 = this.S();
      if (!(s0.focus && s0.sel) && (s0.iso === undefined || s0.iso === null) && eng()) eng().view('sol');
      set({ playing: true, hour: hr });
      this._play = setInterval(() => {
        const nx = Math.round((this.timeState().hour + 0.25) * 4) / 4;
        if (nx > endOf()) { stopPlay(); set({ playing: false }); return; }
        set({ hour: nx });
      }, 260);
    };
    const view = (k) => () => { set({ focus: false, garage: false }); if (eng()) eng().view(k); };
    h.viewGarage = () => { set({ garage: true, focus: false, iso: null, real: null }); if (eng()) eng().view('garagem'); };
    h.viewStreet = view('rua');
    h.viewGarden = view('jardim');
    h.viewAir = view('aerea');
    h.viewSun = view('sol');
    h.rotL = () => { if (eng()) eng().rotate(-45); };
    h.rotR = () => { if (eng()) eng().rotate(45); };
    h.zoomIn = () => { if (eng()) eng().zoom(1 / 1.2); };
    h.zoomOut = () => { if (eng()) eng().zoom(1.2); };
    const current = () => { const s = this.S(); return M.byCode[s.sel === undefined ? M.defaultSel : s.sel]; };
    h.similar = () => { const u = current(); if (u) set({ type: this.TY()[u.type].group, onlyAvail: true, iso: null, focus: false }); };
    h.locate = () => { const u = current(); if (u) set({ sel: u.code, iso: null, focus: true }); };
    const MD = this.MEDIA();
    h.open = {};
    Object.keys(MD.sets).forEach((k) => { h.open[k] = MD.sets[k].map((m, i) => () => set({ lbSet: k, lbI: i })); });
    h.style = { chiara: () => set({ inStyle: 'chiara' }), brown: () => set({ inStyle: 'brown' }) };
    const lbLen = () => { const k = this.S().lbSet; return k && MD.sets[k] ? MD.sets[k].length : 1; };
    h.lbClose = () => set({ lbSet: null });
    const realLen = () => { const k = this.S().real; return k && MD.sets[k] ? MD.sets[k].length : 1; };
    h.realOpen = () => { if (eng()) eng().goHotspot('real'); set({ real: 'real', realI: 0, focus: false, iso: null, garage: false }); };
    h.realClose = () => set({ real: null });
    h.realPrev = () => { const n = realLen(); set({ realI: ((this.S().realI || 0) + n - 1) % n }); };
    h.realNext = () => { const n = realLen(); set({ realI: ((this.S().realI || 0) + 1) % n }); };
    h.lbPrev = () => { const n = lbLen(); set({ lbI: ((this.S().lbI || 0) + n - 1) % n }); };
    h.lbNext = () => { const n = lbLen(); set({ lbI: ((this.S().lbI || 0) + 1) % n }); };
    h.canvasRef = (el) => {
      this._canvas = el;
      if (el) this.boot();
      else if (this._eng) { this._eng.dispose(); this._eng = null; }
    };
    h.stageRef = (el) => {
      if (this._ro) { this._ro.disconnect(); this._ro = null; }
      if (!el || typeof ResizeObserver === 'undefined') return;
      this._ro = new ResizeObserver(() => {
        if (this._eng) this._eng.resize();
        const narrow = el.clientWidth < 640;
        if (narrow !== !!this.S().narrow) this.setState({ narrow: narrow });
      });
      this._ro.observe(el);
    };
    this._h = h;
    return h;
  }

  boot() {
    if (this._eng || this._booting) return;
    this._booting = true;
    const attempt = (n) => {
      if (!this._canvas) { this._booting = false; return; }
      const THREE = window.THREE;
      if (!THREE) {
        if (n > 150) { this._booting = false; this.setState({ glErr: true }); return; }
        this._bootT = setTimeout(() => attempt(n + 1), 100);
        return;
      }
      const M = this.model();
      const specs = M.units.map((u) => ({ code: u.code, f: u.f, x0: u.x0, x1: u.x1, row: u.row, poly: u.poly, c: u.c }));
      let eng = null;
      try {
        eng = this.createEngine(THREE, this._canvas, {
          onReady: () => this.setState({ ready: true }),
          onError: () => this.setState({ glErr: true }),
          onPick: (code) => this.pickUnit(code),
          onHover: (code) => this.setState({ hov: code }),
          onHotspot: (id) => this.setState(id === 'garage' ? { garage: true, real: null, focus: false, iso: null, hov: null } : { real: id, realI: 0, focus: false, hov: null, garage: false })
        }, specs);
      } catch (err) {
        eng = null;
        this.setState({ glErr: true });
      }
      this._booting = false;
      this._eng = eng;
      this._sync = '';
      this._sunKey = '';
      this._hsLang = '';
      this.sync();
    };
    this._bootT = setTimeout(() => attempt(0), 40);
  }

  timeState() {
    const s = this.S();
    const month = this.MONTHS()[s.month] ? s.month : 'jun';
    const hour = typeof s.hour === 'number' ? s.hour : 11;
    return { month: month, hour: hour };
  }

  sync() {
    const e = this._eng;
    if (!e) return;
    const s = this.S(), M = this.model(), P = this.P();
    const tm = this.timeState();
    const st = {
      mode: s.mode || 'facade',
      sel: s.sel === undefined ? M.defaultSel : s.sel,
      iso: (s.iso === undefined || s.iso === null) ? null : s.iso,
      focus: !!s.focus,
      type: s.type || 'all',
      only: !!s.onlyAvail,
      demo: !!P.demo,
      orient: P.orient,
      month: tm.month,
      hour: tm.hour,
      real: s.real || '',
      garage: !!s.garage && !s.real && (s.iso === undefined || s.iso === null) && !s.focus,
      lang: this.lang()
    };
    const key = JSON.stringify(st);
    if (key === this._sync) return;
    const sunKey = st.month + '|' + st.hour + '|' + st.orient;
    const first = !this._sunKey;
    this._sync = key;
    const status = {};
    M.units.forEach((u) => { status[u.code] = this.st(u); });
    const filtering = st.type !== 'all' || st.only;
    const active = filtering ? new Set(M.units.filter((u) => this.matches(u, st.type, st.only)).map((u) => u.code)) : null;
    const upd = { mode: st.mode, sel: st.sel, iso: st.iso, focus: st.focus, status: status, active: active, filtering: filtering, orient: st.orient, hsOn: !st.real, garage: st.garage };
    if (st.lang !== this._hsLang) { const tl = this.tr().hsLabels; upd.hotspots = Object.keys(tl).map((k) => ({ id: k, label: tl[k] })); this._hsLang = st.lang; }
    if (sunKey !== this._sunKey) {
      const m = this.MONTHS()[st.month];
      upd.sun = this.sunAt(m.doy, st.hour, m.tz);
      upd.sunNow = first;
      this._sunKey = sunKey;
    }
    e.update(upd);
  }

  createEngine(THREE, canvas, hooks, specs) {
    hooks = hooks || {};
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' });
    } catch (err) {
      if (hooks.onError) hooks.onError(err);
      return null;
    }
    // phones (iPhone 14 Pro = DPR 3): start at 2x for crisp Retina edges; desktop up to 2x. A frame-time governor in the
    // loop steps the ratio down while the camera moves if the GPU can't keep ~40 fps, so orbiting never stutters.
    const MOBILE = (typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches) || (window.innerWidth || 1200) < 760;
    const DPR_STEPS = MOBILE ? [2, 1.75, 1.5, 1.25] : [2, 1.6, 1.3, 1];
    let dprIdx = 0;
    const dprNow = () => Math.min(window.devicePixelRatio || 1, DPR_STEPS[dprIdx]);
    renderer.setPixelRatio(dprNow());
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.shadowMap.needsUpdate = true;
    const railMeshes = [];

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 4, 1500);
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    let seed = 20221;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

    // ---------------------------------------------------------------- textures
    const tex = (w, h, draw, srgb) => {
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const g = c.getContext('2d');
      draw(g, w, h);
      const t = new THREE.CanvasTexture(c);
      if (srgb !== false) t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = Math.min(8, maxAniso);
      return t;
    };
    const speckle = (g, w, h, n, cols, a, b) => {
      for (let i = 0; i < n; i++) {
        g.fillStyle = cols[(rnd() * cols.length) | 0];
        const r = a + rnd() * (b - a);
        g.fillRect(rnd() * w, rnd() * h, r, r);
      }
    };
    const T = {};
    // ---------------------------------------------------------------- procedural PBR textures (colour + height -> normal), all tileable
    const mk2d = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
    const noiseLayer = (g, w, h, cells, alpha, lo, hi) => {
      const n = cells * 3, t = mk2d(n, n), tg = t.getContext('2d'), id = tg.createImageData(n, n), d = id.data;
      const base = new Float32Array(cells * cells);
      for (let i = 0; i < base.length; i++) base[i] = lo + (hi - lo) * rnd();
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
        const v = base[(y % cells) * cells + (x % cells)], i = (y * n + x) * 4;
        d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
      }
      tg.putImageData(id, 0, 0);
      g.save(); g.globalAlpha = alpha; g.imageSmoothingEnabled = true;
      try { g.imageSmoothingQuality = 'high'; } catch (err) { /* ignore */ }
      g.drawImage(t, -w, -h, w * 3, h * 3);
      g.restore();
    };
    const tint = (g, w, h, cells, alpha, lo, hi) => {
      g.save(); g.globalCompositeOperation = 'soft-light'; noiseLayer(g, w, h, cells, alpha, lo, hi); g.restore();
    };
    const normalFrom = (hc, strength) => {
      const w = hc.width, h = hc.height, src = hc.getContext('2d').getImageData(0, 0, w, h).data;
      const out = mk2d(w, h), og = out.getContext('2d'), id = og.createImageData(w, h), d = id.data;
      for (let y = 0; y < h; y++) {
        const ym = ((y - 1 + h) % h) * w, yp = ((y + 1) % h) * w, y0 = y * w;
        for (let x = 0; x < w; x++) {
          const xm = (x - 1 + w) % w, xp = (x + 1) % w;
          const dx = (src[(y0 + xp) * 4] - src[(y0 + xm) * 4]) / 255 * strength;
          const dy = (src[(yp + x) * 4] - src[(ym + x) * 4]) / 255 * strength;
          const l = Math.sqrt(dx * dx + dy * dy + 1), i = (y0 + x) * 4;
          d[i] = (-dx / l * 0.5 + 0.5) * 255; d[i + 1] = (dy / l * 0.5 + 0.5) * 255; d[i + 2] = (1 / l * 0.5 + 0.5) * 255; d[i + 3] = 255;
        }
      }
      og.putImageData(id, 0, 0);
      return out;
    };
    const finishTex = (t) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = Math.min(8, maxAniso); return t; };
    const pbr = (w, h, draw, strength) => {
      const cc = mk2d(w, h), hc = mk2d(w, h);
      draw(cc.getContext('2d'), hc.getContext('2d'), w, h);
      const map = finishTex(new THREE.CanvasTexture(cc)); map.colorSpace = THREE.SRGBColorSpace;
      const normal = finishTex(new THREE.CanvasTexture(normalFrom(hc, strength)));
      return { map: map, normal: normal };
    };
    const rgb = (r, g2, b) => 'rgb(' + Math.round(r) + ',' + Math.round(g2) + ',' + Math.round(b) + ')';
    const grey = (v) => rgb(v, v, v);
    // tiled slabs/blocks: draws colour + height with joints and a soft bevel
    const blocks = (g, hg, w, h, rows, cols, stagger, joint, colorFn, bevel) => {
      const bh = h / rows, bw = w / cols;
      for (let r = 0; r < rows; r++) for (let c = -1; c <= cols; c++) {
        const x = c * bw + (stagger ? (r % 2) * bw / 2 : 0), y = r * bh;
        g.fillStyle = colorFn(r, c); g.fillRect(x + joint / 2, y + joint / 2, bw - joint, bh - joint);
        for (let k = 0; k <= bevel; k++) {
          hg.fillStyle = grey(150 + (k / Math.max(1, bevel)) * 60);
          hg.fillRect(x + joint / 2 + k, y + joint / 2 + k, bw - joint - 2 * k, bh - joint - 2 * k);
        }
      }
    };
    // light stone cladding / render with faint panel joints
    const PL = pbr(512, 512, (g, hg, w, h) => {
      g.fillStyle = '#dad3c8'; g.fillRect(0, 0, w, h);
      tint(g, w, h, 5, 0.5, 98, 158); tint(g, w, h, 24, 0.42, 102, 154);
      speckle(g, w, h, 30000, ['rgba(255,252,245,.14)', 'rgba(70,62,52,.09)', 'rgba(140,128,112,.09)', 'rgba(110,100,88,.06)'], 0.8, 2.2);
      hg.fillStyle = grey(180); hg.fillRect(0, 0, w, h);
      noiseLayer(hg, w, h, 56, 0.55, 150, 210);
      speckle(hg, w, h, 34000, [grey(140), grey(212)], 0.8, 2.0);
    }, 3.0);
    // grey speckled granite panels (ground and first floor, as in the official renders)
    const STN = pbr(512, 512, (g, hg, w, h) => {
      g.fillStyle = '#7d766e'; g.fillRect(0, 0, w, h);
      hg.fillStyle = grey(60); hg.fillRect(0, 0, w, h);
      blocks(g, hg, w, h, 4, 2, false, 3, () => { const t = 0.96 + rnd() * 0.06; return rgb(182 * t, 175 * t, 166 * t); }, 1);
      tint(g, w, h, 14, 0.3, 110, 146);
      speckle(g, w, h, 30000, ['rgba(60,58,56,.4)', 'rgba(90,88,86,.35)', 'rgba(250,250,250,.45)', 'rgba(160,150,140,.3)'], 0.6, 1.5);
      speckle(hg, w, h, 16000, [grey(185), grey(215)], 0.6, 1.3);
    }, 2.2);
    // long-format brick with recessed mortar
    const BRK = pbr(512, 512, (g, hg, w, h) => {
      g.fillStyle = '#aaa6a2'; g.fillRect(0, 0, w, h);
      hg.fillStyle = grey(60); hg.fillRect(0, 0, w, h);
      const pal = [[121, 88, 80], [112, 81, 75], [130, 96, 87], [104, 76, 70], [118, 87, 80], [136, 101, 91], [98, 72, 67], [125, 92, 83]];   // red-brown, as in the daylight render
      blocks(g, hg, w, h, 16, 3, true, 4, () => { const p = pal[(rnd() * pal.length) | 0], t = 0.9 + rnd() * 0.18; return rgb(p[0] * t, p[1] * t, p[2] * t); }, 2);
      tint(g, w, h, 28, 0.35, 104, 152);
      speckle(g, w, h, 12000, ['rgba(0,0,0,.12)', 'rgba(230,220,220,.05)', 'rgba(40,28,30,.1)'], 0.7, 1.6);
      speckle(hg, w, h, 9000, [grey(170), grey(225)], 0.7, 1.5);
    }, 3.6);
    const WOOD = pbr(256, 256, (g, hg, w, h) => {
      g.fillStyle = '#8a6a4e'; g.fillRect(0, 0, w, h);
      hg.fillStyle = grey(70); hg.fillRect(0, 0, w, h);
      blocks(g, hg, w, h, 8, 1, false, 2, () => { const t = 0.86 + rnd() * 0.24; return rgb(150 * t, 116 * t, 84 * t); }, 1);
      for (let i = 0; i < 900; i++) { const y = rnd() * h; g.fillStyle = 'rgba(70,45,25,' + (0.08 + rnd() * 0.15).toFixed(2) + ')'; g.fillRect(rnd() * w, y, 8 + rnd() * 40, 0.8); }
    }, 2);
    const WAL = pbr(256, 256, (g, hg, w, h) => {
      g.fillStyle = '#4a3528'; g.fillRect(0, 0, w, h);
      hg.fillStyle = grey(70); hg.fillRect(0, 0, w, h);
      blocks(g, hg, w, h, 1, 4, false, 2, () => { const t = 0.9 + rnd() * 0.18; return rgb(112 * t, 80 * t, 58 * t); }, 1);
      for (let i = 0; i < 1400; i++) { const x = rnd() * w; g.fillStyle = 'rgba(45,28,18,' + (0.08 + rnd() * 0.2).toFixed(2) + ')'; g.fillRect(x, rnd() * h, 0.8 + rnd() * 0.8, 10 + rnd() * 60); }
      for (let i = 0; i < 300; i++) { g.fillStyle = 'rgba(170,130,95,' + (0.05 + rnd() * 0.1).toFixed(2) + ')'; g.fillRect(rnd() * w, rnd() * h, 0.8, 20 + rnd() * 50); }
    }, 1.5);
    // limestone paving slabs
    const PAV = pbr(512, 512, (g, hg, w, h) => {
      g.fillStyle = '#8f887c'; g.fillRect(0, 0, w, h);
      hg.fillStyle = grey(70); hg.fillRect(0, 0, w, h);
      blocks(g, hg, w, h, 4, 4, false, 3, () => { const t = 0.9 + rnd() * 0.14; return rgb(212 * t, 205 * t, 192 * t); }, 2);
      tint(g, w, h, 20, 0.45, 100, 156);
      speckle(g, w, h, 14000, ['rgba(0,0,0,.06)', 'rgba(255,255,255,.1)'], 0.7, 1.6);
      speckle(hg, w, h, 9000, [grey(185), grey(220)], 0.7, 1.4);
    }, 3);
    // sidewalk: 60 x 40 cm concrete slabs laid in running bond, two batches of slightly different grey, thin sanded joints,
    // aggregate grain, a few chipped corners, gum spots and damp stains (the large-scale wear comes from the macro shader)
    const WLK = pbr(512, 512, (g, hg, w, h) => {
      g.fillStyle = '#6f6a63'; g.fillRect(0, 0, w, h);
      hg.fillStyle = grey(70); hg.fillRect(0, 0, w, h);
      blocks(g, hg, w, h, 6, 4, true, 2, () => { const t = 0.93 + rnd() * 0.09, c = rnd() < 0.55 ? [181, 176, 168] : [170, 168, 163]; return rgb(c[0] * t, c[1] * t, c[2] * t); }, 1);
      tint(g, w, h, 24, 0.32, 104, 152);
      speckle(g, w, h, 20000, ['rgba(60,56,52,.18)', 'rgba(250,248,242,.15)', 'rgba(120,114,106,.13)'], 0.6, 1.4);
      speckle(hg, w, h, 10000, [grey(150), grey(205)], 0.6, 1.3);
      for (let i = 0; i < 26; i++) { const x = rnd() * w, y = rnd() * h, r = 1.2 + rnd() * 2.2; g.fillStyle = 'rgba(52,48,44,' + (0.2 + rnd() * 0.25).toFixed(2) + ')'; g.beginPath(); g.ellipse(x, y, r, r * (0.7 + rnd() * 0.3), 0, 0, 6.283); g.fill(); }
      for (let i = 0; i < 7; i++) { const x = rnd() * w, y = rnd() * h, r = 14 + rnd() * 30, gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(80,72,62,.12)'); gr.addColorStop(1, 'rgba(80,72,62,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
      for (let i = 0; i < 10; i++) { const x = ((rnd() * 4) | 0) * w / 4 + (rnd() < 0.5 ? 2 : -2), y = ((rnd() * 6) | 0) * h / 6 + 2; g.fillStyle = 'rgba(90,86,80,.55)'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 5 + rnd() * 6, y); g.lineTo(x, y + 4 + rnd() * 5); g.fill(); hg.fillStyle = grey(95); hg.beginPath(); hg.moveTo(x, y); hg.lineTo(x + 5, y); hg.lineTo(x, y + 4); hg.fill(); }
    }, 2.2);
    // granite kerbs (cordoli in granito): light grey speckled stone, a joint every metre
    const KRB = pbr(256, 256, (g, hg, w, h) => {
      g.fillStyle = '#a7a59f'; g.fillRect(0, 0, w, h);
      tint(g, w, h, 6, 0.3, 108, 148);
      speckle(g, w, h, 15000, ['rgba(38,38,40,.42)', 'rgba(72,72,74,.32)', 'rgba(240,238,232,.4)', 'rgba(150,146,140,.3)'], 0.6, 1.5);
      hg.fillStyle = grey(150); hg.fillRect(0, 0, w, h); speckle(hg, w, h, 8000, [grey(128), grey(176)], 0.6, 1.3);
      g.fillStyle = 'rgba(58,56,52,.6)'; g.fillRect(0, 0, 2, h); g.fillRect(0, 0, w, 2);
      hg.fillStyle = grey(70); hg.fillRect(0, 0, 2, h); hg.fillRect(0, 0, w, 2);
    }, 1.6);
    // courtyards of the neighbouring blocks: large grey concrete pavers, oil and rain stains, moss in some joints
    const CRT = pbr(512, 512, (g, hg, w, h) => {
      g.fillStyle = '#625e58'; g.fillRect(0, 0, w, h);
      hg.fillStyle = grey(72); hg.fillRect(0, 0, w, h);
      blocks(g, hg, w, h, 4, 4, false, 3, () => { const t = 0.9 + rnd() * 0.14; return rgb(150 * t, 147 * t, 141 * t); }, 1);
      tint(g, w, h, 12, 0.42, 100, 156); tint(g, w, h, 36, 0.3, 106, 150);
      speckle(g, w, h, 16000, ['rgba(50,48,44,.2)', 'rgba(235,232,225,.14)', 'rgba(110,106,98,.13)'], 0.6, 1.5);
      speckle(hg, w, h, 8000, [grey(150), grey(205)], 0.6, 1.3);
      for (let i = 0; i < 12; i++) { const x = rnd() * w, y = rnd() * h, r = 10 + rnd() * 34, gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(40,36,32,.2)'); gr.addColorStop(1, 'rgba(40,36,32,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
      g.fillStyle = 'rgba(92,104,64,.45)';
      for (let i = 0; i < 18; i++) { const vert = rnd() < 0.5, k = 1 + ((rnd() * 3) | 0), a = rnd() * (w - 60); if (vert) g.fillRect(k * w / 4 - 2, a, 4, 20 + rnd() * 40); else g.fillRect(a, k * h / 4 - 2, 20 + rnd() * 40, 4); }
    }, 2.2);
    const ASP = pbr(512, 512, (g, hg, w, h) => {
      g.fillStyle = '#4b4845'; g.fillRect(0, 0, w, h);
      tint(g, w, h, 10, 0.6, 96, 160); tint(g, w, h, 40, 0.4, 100, 156);
      speckle(g, w, h, 26000, ['#3f3c39', '#5a5652', '#67625d', '#36332f'], 0.7, 1.8);
      hg.fillStyle = grey(128); hg.fillRect(0, 0, w, h);
      speckle(hg, w, h, 30000, [grey(90), grey(170)], 0.7, 1.6);
    }, 2.2);
    const GRS = pbr(512, 512, (g, hg, w, h) => {
      g.fillStyle = '#6c8150'; g.fillRect(0, 0, w, h);
      tint(g, w, h, 6, 0.65, 92, 164); tint(g, w, h, 30, 0.5, 98, 158);
      speckle(g, w, h, 32000, ['#5d7146', '#7f9860', '#90a86c', '#556840', '#9cb37a'], 0.7, 2.2);
      hg.fillStyle = grey(128); hg.fillRect(0, 0, w, h);
      speckle(hg, w, h, 30000, [grey(80), grey(190)], 0.7, 2.0);
    }, 2.6);
    const CTX = pbr(256, 256, (g, hg, w, h) => {
      g.fillStyle = '#efebe4'; g.fillRect(0, 0, w, h);
      tint(g, w, h, 8, 0.35, 112, 144);
      speckle(g, w, h, 4000, ['rgba(0,0,0,.035)', 'rgba(255,255,255,.08)'], 0.7, 1.4);
      hg.fillStyle = grey(128); hg.fillRect(0, 0, w, h);
      noiseLayer(hg, w, h, 32, 0.5, 100, 160);
    }, 1.2);
    const SLB = pbr(256, 256, (g, hg, w, h) => {
      g.fillStyle = '#dfd8cc'; g.fillRect(0, 0, w, h);
      tint(g, w, h, 8, 0.45, 104, 152);
      speckle(g, w, h, 5000, ['rgba(0,0,0,.05)', 'rgba(255,255,255,.08)'], 0.7, 1.4);
      hg.fillStyle = grey(128); hg.fillRect(0, 0, w, h);
      speckle(hg, w, h, 6000, [grey(100), grey(160)], 0.7, 1.4);
    }, 1.5);
    const LEAF = pbr(256, 256, (g, hg, w, h) => {
      g.fillStyle = '#6f8558'; g.fillRect(0, 0, w, h);
      hg.fillStyle = grey(100); hg.fillRect(0, 0, w, h);
      const cols = ['#5b7046', '#7d955f', '#8fa86c', '#4d603c', '#a0b67c', '#66804f'];
      for (let i = 0; i < 2600; i++) {
        const x = rnd() * w, y = rnd() * h, r = 1.5 + rnd() * 4;
        g.fillStyle = cols[(rnd() * cols.length) | 0];
        g.beginPath(); g.ellipse(x, y, r, r * 0.6, rnd() * 3.14, 0, 6.283); g.fill();
        hg.fillStyle = grey(110 + rnd() * 120);
        hg.beginPath(); hg.ellipse(x, y, r, r * 0.6, rnd() * 3.14, 0, 6.283); hg.fill();
      }
    }, 4);
    T.plaster = PL.map; T.plasterN = PL.normal; T.stone = STN.map; T.stoneN = STN.normal; T.brick = BRK.map; T.brickN = BRK.normal;
    T.paving = PAV.map; T.pavingN = PAV.normal; T.walk = WLK.map; T.walkN = WLK.normal; T.asphalt = ASP.map; T.asphaltN = ASP.normal;
    T.kerb = KRB.map; T.kerbN = KRB.normal; T.court = CRT.map; T.courtN = CRT.normal;
    T.grass = GRS.map; T.grassN = GRS.normal; T.context = CTX.map; T.contextN = CTX.normal; T.slab = SLB.map; T.slabN = SLB.normal;
    // olive / plane bark: grey-brown, deep twisting furrows, pale ridges, a little lichen; tiles around the trunk
    T.bark = tex(256, 512, (g, w, h) => {
      g.fillStyle = '#76695c'; g.fillRect(0, 0, w, h);
      const wob = (x, y) => x + Math.sin(y * 0.025 + x * 0.1) * 6 + Math.sin(y * 0.07) * 2;
      for (let k = 0; k < 46; k++) {
        const x0 = rnd() * w, dark = rnd() < 0.6;
        g.strokeStyle = dark ? 'rgba(38,31,25,' + (0.45 + rnd() * 0.35).toFixed(2) + ')' : 'rgba(176,166,150,' + (0.25 + rnd() * 0.25).toFixed(2) + ')';
        g.lineWidth = 1.5 + rnd() * 4; g.lineCap = 'round';
        [-w, 0, w].forEach((dx) => { g.beginPath(); for (let y = -10; y <= h + 10; y += 8) { const x = wob(x0 + dx, y); if (y < 0) g.moveTo(x, y); else g.lineTo(x, y); } g.stroke(); });
      }
      for (let i = 0; i < 26; i++) { const x = rnd() * w, y = rnd() * h, r = 6 + rnd() * 16, gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(160,168,128,.28)'); gr.addColorStop(1, 'rgba(160,168,128,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
      speckle(g, w, h, 5000, ['rgba(30,24,20,.18)', 'rgba(200,190,175,.12)'], 0.8, 1.6);
    });
    T.leaf = LEAF.map; T.leafN = LEAF.normal; T.wood = WOOD.map; T.woodN = WOOD.normal; T.wal = WAL.map; T.walN = WAL.normal;
    // foliage atlas (4 x 2 cells, transparent): leaves dark/mid/light, pink, white, lavender, grasses, olive
    T.fol = (() => {
      const c = mk2d(1024, 512), g = c.getContext('2d');
      g.clearRect(0, 0, 1024, 512);
      const cell = (i, fn) => { const ox = (i % 4) * 256, oy = ((i / 4) | 0) * 256; g.save(); g.beginPath(); g.rect(ox + 3, oy + 3, 250, 250); g.clip(); fn(ox, oy); g.restore(); };
      const leaves = (ox, oy, n, cols, l0, l1, wid, R) => {
        for (let i = 0; i < n; i++) {
          const r = R * Math.sqrt(rnd()), a = rnd() * 6.283;
          const x = ox + 128 + Math.cos(a) * r, y = oy + 128 + Math.sin(a) * r, len = l0 + rnd() * (l1 - l0);
          g.save(); g.translate(x, y); g.rotate(a + (rnd() - 0.5) * 1.4);
          g.fillStyle = cols[(rnd() * cols.length) | 0];
          g.beginPath(); g.ellipse(len / 2, 0, len / 2, len * wid, 0, 0, 6.283); g.fill();
          g.strokeStyle = 'rgba(20,35,15,.35)'; g.lineWidth = 1; g.beginPath(); g.moveTo(1, 0); g.lineTo(len * 0.85, 0); g.stroke();
          g.restore();
        }
      };
      const blossoms = (ox, oy, n, cols, R, rr) => {
        for (let i = 0; i < n; i++) {
          const r = R * Math.sqrt(rnd()), a = rnd() * 6.283, x = ox + 128 + Math.cos(a) * r, y = oy + 128 + Math.sin(a) * r, s2 = rr * (0.7 + rnd() * 0.6);
          g.fillStyle = cols[(rnd() * cols.length) | 0];
          for (let k = 0; k < 5; k++) { const b = k / 5 * 6.283; g.beginPath(); g.arc(x + Math.cos(b) * s2 * 0.6, y + Math.sin(b) * s2 * 0.6, s2 * 0.55, 0, 6.283); g.fill(); }
          g.fillStyle = 'rgba(250,220,120,.9)'; g.beginPath(); g.arc(x, y, s2 * 0.25, 0, 6.283); g.fill();
        }
      };
      const DK = ['#2f4a26', '#3a5a2c', '#2a4222', '#456833', '#355229'], MD = ['#4b6e35', '#5a7d3c', '#43652f', '#678a45', '#527538'], LT = ['#6f9447', '#7fa352', '#8bad5c', '#6a8c43', '#98b866'];
      cell(0, (ox, oy) => leaves(ox, oy, 230, DK.concat(MD), 22, 40, 0.32, 104));
      cell(1, (ox, oy) => leaves(ox, oy, 230, MD.concat(LT), 20, 38, 0.34, 104));
      cell(2, (ox, oy) => leaves(ox, oy, 220, LT.concat(MD), 18, 34, 0.36, 104));
      cell(3, (ox, oy) => { leaves(ox, oy, 170, DK.concat(MD), 20, 36, 0.32, 100); blossoms(ox, oy, 46, ['#e59ac0', '#d77ea8', '#f1b9d2', '#c96b98'], 96, 9); });
      cell(4, (ox, oy) => { leaves(ox, oy, 170, MD, 20, 36, 0.32, 100); blossoms(ox, oy, 50, ['#f7f3ea', '#efe9dc', '#fffdf6'], 96, 8); });
      cell(5, (ox, oy) => {
        leaves(ox, oy, 120, ['#59704a', '#6b8258', '#4f6541'], 26, 46, 0.12, 100);
        for (let i = 0; i < 26; i++) { const x = ox + 40 + rnd() * 176, y0 = oy + 60 + rnd() * 120, h = 30 + rnd() * 40; for (let k = 0; k < 9; k++) { g.fillStyle = ['#8f7cc9', '#a08ed6', '#7b68b6'][(rnd() * 3) | 0]; g.beginPath(); g.ellipse(x + (rnd() - 0.5) * 3, y0 - k * h / 9, 4, 5, 0, 0, 6.283); g.fill(); } }
      });
      cell(6, (ox, oy) => {
        for (let i = 0; i < 150; i++) {
          const x0 = ox + 128 + (rnd() - 0.5) * 70, h = 120 + rnd() * 110, bend = (rnd() - 0.5) * 120;
          g.strokeStyle = ['#5b7440', '#6c874b', '#4e6837', '#7d9455', '#8a9a62'][(rnd() * 5) | 0]; g.lineWidth = 1.6 + rnd() * 1.8;
          g.beginPath(); g.moveTo(x0, oy + 254); g.quadraticCurveTo(x0 + bend * 0.3, oy + 254 - h * 0.6, x0 + bend, oy + 254 - h); g.stroke();
        }
      });
      cell(7, (ox, oy) => leaves(ox, oy, 260, ['#7d8a6a', '#94a07f', '#a7b192', '#6d7a5c', '#b5bea2'], 22, 38, 0.16, 106));
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = Math.min(8, maxAniso);
      return t;
    })();
    T.rail = tex(64, 64, (g, w, h) => {
      g.clearRect(0, 0, w, h);
      g.fillStyle = '#ffffff';
      g.fillRect(0, 0, 7, h);
      g.fillRect(0, h - 3, w, 3);
    }, false);
    // lit interiors: a 4 x 2 atlas of rooms, each window samples one cell
    T.interior = tex(512, 256, (g, w, h) => {
      const cw = w / 4, ch = h / 2;
      const walls = [['#fff1d6', '#f3c98d', '#6d4528'], ['#fbf3e6', '#e9d5b5', '#5d4a3a'], ['#ffe6c4', '#eab57a', '#5e3a22'], ['#f6efe5', '#d9c3a2', '#4e4034']];
      for (let cy = 0; cy < 2; cy++) for (let cx = 0; cx < 4; cx++) {
        const x0 = cx * cw, y0 = cy * ch, wl = walls[(rnd() * walls.length) | 0];
        const gr = g.createLinearGradient(0, y0, 0, y0 + ch);
        gr.addColorStop(0, wl[0]); gr.addColorStop(0.55, wl[1]); gr.addColorStop(1, wl[2]);
        g.fillStyle = gr; g.fillRect(x0, y0, cw, ch);
        const lx = x0 + cw * (0.3 + rnd() * 0.4);
        const rg = g.createRadialGradient(lx, y0 + ch * 0.18, 2, lx, y0 + ch * 0.18, cw * 0.55);
        rg.addColorStop(0, 'rgba(255,250,235,.85)'); rg.addColorStop(1, 'rgba(255,240,210,0)');
        g.fillStyle = rg; g.fillRect(x0, y0, cw, ch);
        g.fillStyle = 'rgba(70,45,28,.55)'; g.fillRect(x0, y0 + ch * 0.8, cw, ch * 0.2);
        const k = (rnd() * 4) | 0, dark = 'rgba(38,26,18,.82)';
        g.fillStyle = dark;
        if (k === 0) { g.fillRect(x0 + cw * 0.18, y0 + ch * 0.62, cw * 0.55, ch * 0.18); g.fillRect(x0 + cw * 0.16, y0 + ch * 0.55, cw * 0.08, ch * 0.25); g.fillRect(x0 + cw * 0.68, y0 + ch * 0.55, cw * 0.08, ch * 0.25); }
        else if (k === 1) { for (let s = 0; s < 4; s++) g.fillRect(x0 + cw * 0.62, y0 + ch * (0.25 + s * 0.15), cw * 0.3, ch * 0.025); g.fillRect(x0 + cw * 0.62, y0 + ch * 0.22, cw * 0.025, ch * 0.6); g.fillRect(x0 + cw * 0.15, y0 + ch * 0.66, cw * 0.32, ch * 0.04); g.fillRect(x0 + cw * 0.2, y0 + ch * 0.7, cw * 0.025, ch * 0.12); g.fillRect(x0 + cw * 0.42, y0 + ch * 0.7, cw * 0.025, ch * 0.12); }
        else if (k === 2) { g.fillRect(x0 + cw * 0.25, y0 + ch * 0.68, cw * 0.5, ch * 0.12); g.fillRect(x0 + cw * 0.2, y0 + ch * 0.52, cw * 0.6, ch * 0.18); g.fillStyle = 'rgba(255,236,200,.5)'; g.fillRect(x0 + cw * 0.3, y0 + ch * 0.3, cw * 0.4, ch * 0.16); }
        else { g.beginPath(); g.arc(x0 + cw * 0.3, y0 + ch * 0.48, cw * 0.12, 0, 6.283); g.fill(); g.fillRect(x0 + cw * 0.29, y0 + ch * 0.5, cw * 0.02, ch * 0.3); g.fillRect(x0 + cw * 0.5, y0 + ch * 0.64, cw * 0.36, ch * 0.16); }
        const cur = g.createLinearGradient(x0, 0, x0 + cw, 0);
        cur.addColorStop(0, 'rgba(255,248,236,.55)'); cur.addColorStop(0.12, 'rgba(255,248,236,0)'); cur.addColorStop(0.88, 'rgba(255,248,236,0)'); cur.addColorStop(1, 'rgba(255,248,236,.55)');
        g.fillStyle = cur; g.fillRect(x0, y0, cw, ch);
        g.fillStyle = 'rgba(255,244,225,.10)';
        for (let x = x0; x < x0 + cw; x += 9) g.fillRect(x, y0, 4, ch);
      }
    });
    T.interior.wrapS = T.interior.wrapT = THREE.ClampToEdgeWrapping;
    T.curtain = tex(512, 256, (g, w, h) => {
      const cw = w / 4, ch = h / 2;
      for (let cy = 0; cy < 2; cy++) for (let cx = 0; cx < 4; cx++) {
        const x0 = cx * cw, y0 = cy * ch;
        g.fillStyle = '#3f3a35'; g.fillRect(x0, y0, cw, ch);
        const open = rnd(), gap = open < 0.35 ? 0 : cw * (0.15 + rnd() * 0.35);
        const L = (cw - gap) / 2;
        [[x0, x0 + L], [x0 + cw - L, x0 + cw]].forEach((seg) => {
          for (let x = seg[0]; x < seg[1]; x += 2) {
            const v = 214 + Math.sin((x - seg[0]) * 0.55) * 14 + (rnd() - 0.5) * 6;
            g.fillStyle = 'rgb(' + Math.round(v) + ',' + Math.round(v - 5) + ',' + Math.round(v - 13) + ')';
            g.fillRect(x, y0, 2, ch);
          }
        });
        const gr = g.createLinearGradient(0, y0, 0, y0 + ch);
        gr.addColorStop(0, 'rgba(0,0,0,.18)'); gr.addColorStop(0.2, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.12)');
        g.fillStyle = gr; g.fillRect(x0, y0, cw, ch);
      }
    });
    T.curtain.wrapS = T.curtain.wrapT = THREE.ClampToEdgeWrapping;

    // ---- Milanese neighbour facades. One tile = one bay (3.4 m) x one storey (3.1 m); colour comes from the material tint.
    const facadeTex = (modern) => tex(512, 512, (g, w, h) => {
      g.fillStyle = '#f7f4ef'; g.fillRect(0, 0, w, h);
      tint(g, w, h, 6, 0.25, 112, 144);
      speckle(g, w, h, 6000, ['rgba(0,0,0,.035)', 'rgba(255,255,255,.08)'], 0.7, 1.4);
      g.fillStyle = 'rgba(0,0,0,.07)'; g.fillRect(0, h - 7, w, 7);
      const wx0 = modern ? 118 : 162, wx1 = modern ? 394 : 350, wy0 = modern ? 96 : 107, wy1 = modern ? 400 : 363;
      if (!modern) {
        // open green shutters (persiane) and a stone sill
        [[wx0 - 92, wx0 - 6], [wx1 + 6, wx1 + 92]].forEach((sx) => {
          g.fillStyle = '#56644f'; g.fillRect(sx[0], wy0, sx[1] - sx[0], wy1 - wy0);
          for (let y = wy0 + 6; y < wy1; y += 9) { g.fillStyle = 'rgba(20,30,18,.35)'; g.fillRect(sx[0] + 6, y, sx[1] - sx[0] - 12, 3); }
          g.strokeStyle = 'rgba(25,32,22,.6)'; g.lineWidth = 4; g.strokeRect(sx[0] + 2, wy0 + 2, sx[1] - sx[0] - 4, wy1 - wy0 - 4);
        });
      }
      g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(wx0 - 6, wy0 - 6, wx1 - wx0 + 12, wy1 - wy0 + 12);
      const gl = g.createLinearGradient(0, wy0, 0, wy1);
      gl.addColorStop(0, '#5d6670'); gl.addColorStop(0.45, '#2f353b'); gl.addColorStop(1, '#3c4248');
      g.fillStyle = gl; g.fillRect(wx0, wy0, wx1 - wx0, wy1 - wy0);
      g.fillStyle = 'rgba(232,226,214,.55)'; g.fillRect(wx0 + 10, wy0 + 8, (wx1 - wx0) * 0.32, wy1 - wy0 - 16);
      g.fillStyle = modern ? '#3a3a3a' : '#ece7dd';
      g.fillRect(wx0, wy0, wx1 - wx0, 7); g.fillRect(wx0, wy1 - 7, wx1 - wx0, 7); g.fillRect(wx0, wy0, 7, wy1 - wy0); g.fillRect(wx1 - 7, wy0, 7, wy1 - wy0);
      g.fillRect((wx0 + wx1) / 2 - 3, wy0, 6, wy1 - wy0);
      g.fillRect(wx0, wy0 + (wy1 - wy0) * 0.28, wx1 - wx0, 5);
      if (modern) {
        g.fillStyle = 'rgba(40,40,40,.85)'; g.fillRect(wx0 - 30, 300, wx1 - wx0 + 60, 5); g.fillRect(wx0 - 30, wy1 - 2, wx1 - wx0 + 60, 6);
        for (let x = wx0 - 26; x < wx1 + 30; x += 14) g.fillRect(x, 300, 3, wy1 - 300);
        g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(wx0 - 34, wy1 + 4, wx1 - wx0 + 68, 16);
      } else {
        g.fillStyle = '#e4ddd0'; g.fillRect(wx0 - 14, wy1, wx1 - wx0 + 28, 12);
        g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(wx0 - 14, wy1 + 12, wx1 - wx0 + 28, 5);
      }
    });
    T.ctxF = facadeTex(false); T.ctxF2 = facadeTex(true);
    // ground floor shops: one tile = 3.4 m x 3.8 m
    T.shop = tex(512, 576, (g, w, h) => {
      g.fillStyle = '#c9c3b8'; g.fillRect(0, 0, w, h);
      tint(g, w, h, 8, 0.3, 112, 144);
      for (let y = 0; y < h; y += 48) { g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(0, y, w, 2); }
      g.fillStyle = '#2b2a28'; g.fillRect(52, 70, w - 104, 60);
      g.fillStyle = 'rgba(236,222,190,.85)'; g.fillRect(120, 92, w - 240, 14);
      const gl = g.createLinearGradient(0, 140, 0, 530);
      gl.addColorStop(0, '#4a4540'); gl.addColorStop(0.6, '#2c2925'); gl.addColorStop(1, '#5a4b3a');
      g.fillStyle = gl; g.fillRect(52, 140, w - 104, 390);
      g.fillStyle = 'rgba(255,214,150,.22)'; g.fillRect(70, 360, w - 140, 150);
      g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(80, 150, 120, 370);
      g.fillStyle = '#1f1e1c';
      g.fillRect(52, 140, w - 104, 8); g.fillRect(52, 522, w - 104, 8); g.fillRect(52, 140, 8, 390); g.fillRect(w - 60, 140, 8, 390); g.fillRect(w / 2 - 4, 140, 8, 390);
      g.fillStyle = '#b7b0a5'; g.fillRect(0, 530, w, h - 530);
    });
    // clay roof tiles (courses run along u)
    const TIL = pbr(256, 256, (g, hg, w, h) => {
      g.fillStyle = '#6d4c3e'; g.fillRect(0, 0, w, h);
      hg.fillStyle = grey(60); hg.fillRect(0, 0, w, h);
      blocks(g, hg, w, h, 8, 6, true, 2, () => { const t = 0.86 + rnd() * 0.22; return rgb(146 * t, 104 * t, 88 * t); }, 3);
      tint(g, w, h, 10, 0.35, 104, 152);
      speckle(g, w, h, 5000, ['rgba(0,0,0,.12)', 'rgba(255,240,220,.08)'], 0.7, 1.6);
    }, 4);
    T.tiles = TIL.map; T.tilesN = TIL.normal;
    // flat roofs of the neighbours: grey gravel on a membrane with tar seams (seen from above in every overview)
    const GRV = pbr(256, 256, (g, hg, w, h) => {
      g.fillStyle = '#a49e93'; g.fillRect(0, 0, w, h);
      tint(g, w, h, 6, 0.5, 100, 156); tint(g, w, h, 22, 0.35, 104, 152);
      speckle(g, w, h, 11000, ['#8b857a', '#c2bcb0', '#b2aca0', '#79746a', '#d0cbc0'], 0.8, 1.9);
      hg.fillStyle = grey(128); hg.fillRect(0, 0, w, h); speckle(hg, w, h, 11000, [grey(88), grey(182)], 0.8, 1.7);
      g.strokeStyle = 'rgba(58,54,48,.32)'; g.lineWidth = 2;
      for (let k = 0; k < 3; k++) { const y = (k + 0.5) * h / 3 + (rnd() - 0.5) * 10; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    }, 1.6);
    T.gravel = GRV.map; T.gravelN = GRV.normal;
    // plane-tree bark: the camouflage of a platanus, olive-grey, cream and green-grey flakes
    // plane-tree bark (platanus): smooth, pale; old grey-olive bark flakes off in jigsaw plates that uncover cream and
    // light ochre underneath. Low contrast, plates taller than wide
    T.planeBark = tex(256, 512, (g, w, h) => {
      g.fillStyle = '#c9c4b2'; g.fillRect(0, 0, w, h);
      const plate = (x, y, rx, ry, col) => {
        const n = 7 + ((rnd() * 4) | 0), pts = [];
        for (let k = 0; k < n; k++) { const a = k / n * 6.283, rr = 0.72 + rnd() * 0.42; pts.push([Math.cos(a) * rx * rr, Math.sin(a) * ry * rr]); }
        g.fillStyle = col;
        [-w, 0, w].forEach((dx) => { g.beginPath(); pts.forEach((p, k) => (k ? g.lineTo : g.moveTo).call(g, x + dx + p[0], y + p[1])); g.closePath(); g.fill(); });
      };
      const under = ['#d8d2bd', '#d3caac', '#ddd8c6', '#cdc3a3'], old = ['#b8b49f', '#afab96', '#bfbaa5', '#a5a38e', '#b3af99'];
      for (let i = 0; i < 70; i++) plate(rnd() * w, rnd() * h, 14 + rnd() * 26, 22 + rnd() * 44, under[(rnd() * under.length) | 0]);
      for (let i = 0; i < 80; i++) plate(rnd() * w, rnd() * h, 12 + rnd() * 26, 20 + rnd() * 44, old[(rnd() * old.length) | 0]);
      for (let i = 0; i < 14; i++) plate(rnd() * w, rnd() * h, 6 + rnd() * 10, 8 + rnd() * 16, 'rgba(120,120,100,.4)');
      speckle(g, w, h, 5000, ['rgba(60,56,46,.1)', 'rgba(255,252,240,.1)'], 0.8, 1.6);
    });
    // warm lobby seen through the entrance glass (cam-06): chandeliers, timber walls, travertine floor
    T.lobby = tex(512, 512, (g, w, h) => {
      const bg = g.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#6b4a2a'); bg.addColorStop(0.18, '#9a6c3c'); bg.addColorStop(0.62, '#4a3220'); bg.addColorStop(0.78, '#2c1f15'); bg.addColorStop(1, '#c9b394');
      g.fillStyle = bg; g.fillRect(0, 0, w, h);
      g.fillStyle = 'rgba(255,226,170,0.55)'; g.fillRect(0, h * 0.06, w, 6);
      for (let x = 18; x < w; x += 46) { g.fillStyle = 'rgba(40,24,12,0.35)'; g.fillRect(x, h * 0.12, 3, h * 0.62); }
      [[0.28, 0.24], [0.72, 0.24]].forEach((c) => {
        const gr = g.createRadialGradient(c[0] * w, c[1] * h, 2, c[0] * w, c[1] * h, w * 0.26);
        gr.addColorStop(0, 'rgba(255,248,226,1)'); gr.addColorStop(0.12, 'rgba(255,224,160,0.9)'); gr.addColorStop(0.45, 'rgba(255,190,110,0.28)'); gr.addColorStop(1, 'rgba(255,170,90,0)');
        g.fillStyle = gr; g.fillRect(0, 0, w, h);
        g.strokeStyle = 'rgba(255,236,190,0.9)'; g.lineWidth = 2;
        for (let k = -3; k <= 3; k++) { g.beginPath(); g.moveTo(c[0] * w + k * 9, c[1] * h - 20); g.lineTo(c[0] * w + k * 14, c[1] * h + 18); g.stroke(); }
      });
      g.fillStyle = 'rgba(232,214,186,0.9)'; g.fillRect(w * 0.36, h * 0.62, w * 0.28, h * 0.14);
      g.fillStyle = 'rgba(255,230,180,0.5)'; g.fillRect(w * 0.36, h * 0.62, w * 0.28, 4);
      [[0.04, 0.2], [0.76, 0.2]].forEach((c) => { g.fillStyle = 'rgba(214,200,180,0.85)'; g.fillRect(c[0] * w, h * 0.68, c[1] * w, h * 0.09); g.fillRect(c[0] * w, h * 0.63, c[1] * w * 0.18, h * 0.14); });
      const fl = g.createLinearGradient(0, h * 0.8, 0, h); fl.addColorStop(0, 'rgba(255,236,200,0.5)'); fl.addColorStop(1, 'rgba(255,236,200,0)');
      g.fillStyle = fl; g.fillRect(0, h * 0.8, w, h * 0.2);
    });
    // brass name plate at the entrance pier
    T.plaque = tex(256, 352, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, w, h);
      gr.addColorStop(0, '#e3c88a'); gr.addColorStop(0.45, '#c6a464'); gr.addColorStop(1, '#a8874c');
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
      g.strokeStyle = 'rgba(70,48,20,0.55)'; g.lineWidth = 3; g.strokeRect(14, 14, w - 28, h - 28);
      g.fillStyle = '#3a2810'; g.textAlign = 'center';
      g.font = 'italic 30px "Bodoni Moda", Didot, "Times New Roman", serif'; g.fillText('Casa', w / 2, h * 0.42);
      g.font = '52px "Bodoni Moda", Didot, "Times New Roman", serif'; g.fillText('Pasinetti', w / 2, h * 0.58);
      g.font = '15px "Instrument Sans", Arial, sans-serif'; g.fillText('VIA A. PASINETTI 4-8', w / 2, h * 0.74);
    });
    // ---------------------------------------------------------------- materials
    const std = (o) => new THREE.MeshStandardMaterial(o);
    const phy = (o) => new THREE.MeshPhysicalMaterial(Object.assign({ ior: 1.52, clearcoat: 1, clearcoatRoughness: 0.03, specularIntensity: 1 }, o));
    const MAT = {
      plaster: std({ color: 0xf2eee8, map: T.plaster, normalMap: T.plasterN, normalScale: new THREE.Vector2(0.9, 0.9), roughness: 0.9 }),
      stone: std({ map: T.stone, normalMap: T.stoneN, normalScale: new THREE.Vector2(1.2, 1.2), roughness: 0.82 }),
      brick: std({ color: 0xf0eced, map: T.brick, normalMap: T.brickN, normalScale: new THREE.Vector2(1.6, 1.6), roughness: 0.9 }),
      inner: std({ color: 0xe6dccb, roughness: 0.92 }),
      slab: std({ map: T.slab, normalMap: T.slabN, normalScale: new THREE.Vector2(0.6, 0.6), roughness: 0.85 }),
      frame: std({ color: 0x45484b, roughness: 0.5, metalness: 0.45 }),
      glass: phy({ map: T.curtain, color: 0xb4bcc4, roughness: 0.06, metalness: 0.55 }),
      glassLit: phy({ map: T.curtain, color: 0x120d09, emissive: 0xffffff, emissiveMap: T.interior, emissiveIntensity: 1.0, roughness: 0.2, metalness: 0.15 }),
      glassLitB: phy({ map: T.curtain, color: 0x120d09, emissive: 0xffffff, emissiveMap: T.interior, emissiveIntensity: 1.0, roughness: 0.2, metalness: 0.15 }),
      glassLitC: phy({ map: T.curtain, color: 0x120d09, emissive: 0xffffff, emissiveMap: T.interior, emissiveIntensity: 1.0, roughness: 0.2, metalness: 0.15 }),
      glassDim: phy({ map: T.curtain, color: 0x120d09, emissive: 0xffffff, emissiveMap: T.interior, emissiveIntensity: 0.38, roughness: 0.15, metalness: 0.5 }),
      soffit: std({ color: 0xb9b6b1, roughness: 0.95 }),
      light: std({ color: 0xfff0d8, emissive: 0xffd6a0, emissiveIntensity: 1.0, roughness: 1 }),
      rail: std({ color: 0x34363a, alphaMap: T.rail, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.5, metalness: 0.5 }),
      paving: std({ map: T.paving, normalMap: T.pavingN, normalScale: new THREE.Vector2(0.9, 0.9), roughness: 0.9 }),
      grass: std({ map: T.grass, normalMap: T.grassN, normalScale: new THREE.Vector2(0.7, 0.7), roughness: 1 }),
      asphalt: std({ map: T.asphalt, normalMap: T.asphaltN, normalScale: new THREE.Vector2(0.6, 0.6), roughness: 0.92 }),
      walk: std({ map: T.walk, normalMap: T.walkN, normalScale: new THREE.Vector2(0.8, 0.8), roughness: 0.93 }),
      fol: (() => {
        const m = std({ map: T.fol, alphaTest: 0.42, side: THREE.DoubleSide, roughness: 0.82, metalness: 0, color: 0xc8cdb9 });
        m.onBeforeCompile = (sh) => { sh.fragmentShader = sh.fragmentShader.replace('#include <normal_fragment_begin>', THREE.ShaderChunk.normal_fragment_begin.replace(/normal \*= faceDirection;/g, '')); };
        return m;
      })(),
      leaf: std({ map: T.leaf, normalMap: T.leafN, normalScale: new THREE.Vector2(1.4, 1.4), color: 0xf2f6ea, roughness: 0.85 }),
      leaf2: std({ map: T.leaf, normalMap: T.leafN, normalScale: new THREE.Vector2(1.4, 1.4), color: 0xc4d0b6, roughness: 0.85 }),
      trunk: std({ map: T.bark, color: 0xffffff, roughness: 0.95 }),
      planter: std({ color: 0x48494b, roughness: 0.6, metalness: 0.3 }),
      context: std({ map: T.context, normalMap: T.contextN, normalScale: new THREE.Vector2(0.5, 0.5), roughness: 0.86 }),
      plinth: std({ color: 0xcdbdae, roughness: 0.78, metalness: 0 }),
      board: std({ color: 0xb9b3a9, roughness: 0.92 }),
      brass: std({ color: 0xc19d5f, roughness: 0.3, metalness: 1 }),
      curb: std({ color: 0xdcd7cf, roughness: 0.85 }),
      kerb: std({ map: T.kerb, normalMap: T.kerbN, normalScale: new THREE.Vector2(0.7, 0.7), roughness: 0.74 }),
      court: std({ map: T.court, normalMap: T.courtN, normalScale: new THREE.Vector2(0.7, 0.7), color: 0xdcd9d4, roughness: 0.9 }),
      courtP: std({ map: T.court, normalMap: T.courtN, normalScale: new THREE.Vector2(0.7, 0.7), roughness: 0.88 }),
      manhole: std({ color: 0x45423e, roughness: 0.5, metalness: 0.55 }),
      // car paint: a metallic or solid base under a clear coat (sharp sky reflections on the roof and bonnet)
      carA: phy({ color: 0x3a3d42, roughness: 0.38, metalness: 0.55, clearcoatRoughness: 0.05 }),
      carB: phy({ color: 0xe6e5e1, roughness: 0.42, metalness: 0.0, clearcoatRoughness: 0.05 }),
      carC: phy({ color: 0xa9adb2, roughness: 0.36, metalness: 0.7, clearcoatRoughness: 0.05 }),
      carD: phy({ color: 0x1c2740, roughness: 0.38, metalness: 0.5, clearcoatRoughness: 0.05 }),
      carE: phy({ color: 0x141414, roughness: 0.35, metalness: 0.3, clearcoatRoughness: 0.04 }),
      carF: phy({ color: 0x5e6266, roughness: 0.36, metalness: 0.6, clearcoatRoughness: 0.05 }),
      carG: phy({ color: 0x6e231d, roughness: 0.38, metalness: 0.45, clearcoatRoughness: 0.05 }),
      // dark tinted glass: a dielectric, so it reads black head-on and picks up the sky only at grazing angles
      carGlass: phy({ color: 0x0b0e12, roughness: 0.05, metalness: 0.0, clearcoat: 0 }),
      trim: std({ color: 0x1d1e20, roughness: 0.62 }),
      tyre: std({ color: 0x1b1a19, roughness: 0.92 }),
      zebra: std({ color: 0xe8e5de, roughness: 0.8 }),
      alu: std({ color: 0x8c8f92, roughness: 0.38, metalness: 0.55 }),
      perg: std({ color: 0x4a4641, roughness: 0.38, metalness: 0.6 }),
      pergL: std({ color: 0xd2d2cf, roughness: 0.5, metalness: 0.25 }),
      flowerP: std({ color: 0xd98cb3, roughness: 0.8 }),
      flowerW: std({ color: 0xf3efe7, roughness: 0.8 }),
      flowerL: std({ color: 0x9a86cf, roughness: 0.8 }),
      porc: std({ map: T.paving, normalMap: T.pavingN, normalScale: new THREE.Vector2(0.5, 0.5), color: 0xcdbfb0, roughness: 0.72 }),
      walnut: std({ map: T.wal, normalMap: T.walN, normalScale: new THREE.Vector2(0.5, 0.5), color: 0xffffff, roughness: 0.5 }),
      bronze: std({ color: 0x8a7150, roughness: 0.32, metalness: 0.85 }),
      poolWall: std({ color: 0x2c2d2f, roughness: 0.5, metalness: 0.1 }),
      stoneW: std({ normalMap: T.plasterN, normalScale: new THREE.Vector2(0.8, 0.8), color: 0xb3a493, roughness: 0.82 }),
      stoneT: std({ normalMap: T.plasterN, normalScale: new THREE.Vector2(0.6, 0.6), color: 0xd2c3ae, roughness: 0.6 }),
      trav: std({ map: T.plaster, normalMap: T.plasterN, normalScale: new THREE.Vector2(1.4, 1.4), color: 0xe8dcc6, roughness: 0.7 }),
      taupe: std({ color: 0x8c7b6b, roughness: 0.95 }),
      rope: std({ color: 0x6b6258, roughness: 0.9 }),
      oak: std({ color: 0xc2a586, roughness: 0.72 }),
      parapetT: std({ color: 0x9a8a7a, roughness: 0.92 }),
      water: std({ color: 0x4d6e68, normalMap: T.plasterN, normalScale: new THREE.Vector2(0.3, 0.3), emissive: 0x2a9fb5, emissiveIntensity: 0.0, roughness: 0.05, metalness: 0.4 }),
      deck: std({ map: T.wood, normalMap: T.woodN, roughness: 0.75 }),
      cushion: std({ color: 0xece6db, roughness: 0.95 }),
      roofT: std({ map: T.tiles, normalMap: T.tilesN, normalScale: new THREE.Vector2(0.9, 0.9), color: 0xf1e7df, roughness: 0.9 }),   // clay coppi, as on Milanese roofs
      ctx0: std({ map: T.ctxF, normalMap: T.contextN, normalScale: new THREE.Vector2(0.4, 0.4), color: 0xdacdb8, roughness: 0.92 }),
      ctx1: std({ map: T.ctxF, normalMap: T.contextN, normalScale: new THREE.Vector2(0.4, 0.4), color: 0xcfb28c, roughness: 0.92 }),
      ctx2: std({ map: T.ctxF, normalMap: T.contextN, normalScale: new THREE.Vector2(0.4, 0.4), color: 0xc3bfb8, roughness: 0.92 }),
      ctx3: std({ map: T.ctxF2, normalMap: T.contextN, normalScale: new THREE.Vector2(0.4, 0.4), color: 0xd2bd99, roughness: 0.92 }),
      ctx4: std({ map: T.ctxF2, normalMap: T.contextN, normalScale: new THREE.Vector2(0.4, 0.4), color: 0xc1977f, roughness: 0.92 }),
      shop: std({ map: T.shop, roughness: 0.7 }),
      roofF: std({ map: T.gravel, normalMap: T.gravelN, normalScale: new THREE.Vector2(0.7, 0.7), color: 0xffffff, roughness: 0.95 }),
      trunkP: std({ map: T.planeBark, roughness: 0.9 }),
      roofM: std({ map: T.gravel, normalMap: T.gravelN, normalScale: new THREE.Vector2(0.7, 0.7), color: 0x9a958c, roughness: 0.96 }),
      rim: std({ color: 0xa3a7ab, roughness: 0.32, metalness: 0.85 }),
      headL: std({ color: 0xd9dde0, roughness: 0.15, metalness: 0.4 }),
      lobbyGlass: phy({ color: 0x0f0b08, emissive: 0xffffff, emissiveMap: T.lobby, emissiveIntensity: 0.95, roughness: 0.12, metalness: 0.35 }),
      plaque: std({ map: T.plaque, roughness: 0.3, metalness: 0.8 }),
      gFloor: std({ map: T.slab, normalMap: T.slabN, normalScale: new THREE.Vector2(0.25, 0.25), color: 0x8a8a88, roughness: 0.5 }),
      gLine: std({ color: 0xece9e2, roughness: 0.6 }),
      gConc: std({ map: T.slab, normalMap: T.slabN, normalScale: new THREE.Vector2(0.5, 0.5), color: 0xd6d2cb, roughness: 0.88 }),
      gAisle: std({ color: 0x6c776f, roughness: 0.42 }),
      gStripe: std({ color: 0xd8a42a, roughness: 0.55, side: THREE.DoubleSide }),
      gDark: std({ color: 0x232323, roughness: 0.55 }),
      gPipe: std({ color: 0xa3261d, roughness: 0.45, metalness: 0.2 }),
      gDuct: std({ color: 0xb7b9bb, roughness: 0.4, metalness: 0.7 }),
      gExit: std({ color: 0x0c3a1e, emissive: 0x27d36a, emissiveIntensity: 1.4, roughness: 0.4 }),
      gLamp: std({ color: 0xffffff, emissive: 0xf4f6ff, emissiveIntensity: 1.6, roughness: 0.4 }),
      tail: std({ color: 0x3a0806, emissive: 0xc0160c, emissiveIntensity: 0.55, roughness: 0.3 }),
      tram: std({ color: 0x77736d, roughness: 0.35, metalness: 0.7 })
    };
    // alpha-to-coverage: leaf cards and bar railings get soft, anti-aliased edges from the MSAA samples instead of stair-steps
    if (renderer.capabilities.isWebGL2) { MAT.fol.alphaToCoverage = true; MAT.rail.alphaToCoverage = true; }
    // large-scale wear on the ground that never repeats: two octaves of world-space value noise (cells of roughly 8-16 m and
    // 2-4 m) lighten and darken the tiled texture, so long roads, sidewalks, courtyards and lawns lose the visible texture repeat
    const MACRO_GLSL = 'float pzH(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }\n' +
      'float pzN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(pzH(i), pzH(i + vec2(1.0, 0.0)), f.x), mix(pzH(i + vec2(0.0, 1.0)), pzH(i + vec2(1.0, 1.0)), f.x), f.y); }\n';
    const macro = (m, amp, sc) => {
      m.onBeforeCompile = (sh) => {
        sh.uniforms.pzAmp = { value: amp }; sh.uniforms.pzSc = { value: sc };
        sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec2 vPzW;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvPzW = (modelMatrix * vec4(transformed, 1.0)).xz;');
        sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec2 vPzW; uniform float pzAmp; uniform float pzSc;\n' + MACRO_GLSL)
          .replace('#include <map_fragment>', '#include <map_fragment>\n{ float pzn = pzN(vPzW * pzSc) * 0.62 + pzN(vPzW * pzSc * 3.9 + 17.0) * 0.38; diffuseColor.rgb *= 1.0 + pzAmp * (pzn - 0.5) * 2.0; }');
      };
      m.customProgramCacheKey = () => 'pzMacro';   // one program for every ground material; strength and scale are uniforms
    };
    macro(MAT.asphalt, 0.12, 0.06); macro(MAT.walk, 0.09, 0.075); macro(MAT.court, 0.14, 0.065); macro(MAT.grass, 0.17, 0.12); macro(MAT.roofM, 0.1, 0.09); macro(MAT.courtP, 0.12, 0.065);

    // ---- windows: a real room behind every pane (interior mapping). The view ray is taken into the pane's own frame and
    // traced through a box room: back wall = the painted room of that atlas cell, side walls, oak floor, lit ceiling.
    // Sheer curtains sit on the glass plane; the glass itself is dark with Fresnel reflections of the sky (metalness 0).
    const ROOM_GLSL = [
      '#ifdef USE_EMISSIVEMAP',
      '{',
      '  vec2 auv = vEmissiveMapUv;',
      '  vec2 cell = floor(auv * vec2(4.0, 2.0));',
      '  vec2 luv = clamp((fract(auv * vec2(4.0, 2.0)) - 0.04) / 0.92, 0.0, 1.0);',
      '  vec3 sp = -vViewPosition;',
      '  vec3 q0 = dFdx(sp), q1 = dFdy(sp); vec2 s0 = dFdx(auv), s1 = dFdy(auv);',
      '  float jd = s0.x * s1.y - s1.x * s0.y;',
      '  vec3 dPdu = (q0 * s1.y - q1 * s0.y) / (abs(jd) < 1e-12 ? 1e-12 : jd);',
      '  vec3 dPdv = (q1 * s0.x - q0 * s1.x) / (abs(jd) < 1e-12 ? 1e-12 : jd);',
      '  float Wm = max(0.3, length(dPdu) * 0.23), Hm = max(0.3, length(dPdv) * 0.46);',
      '  vec3 Tu = normalize(dPdu), Tv = normalize(dPdv), Nn = normalize(cross(Tu, Tv));',
      '  if (dot(Nn, sp) > 0.0) Nn = -Nn;',
      '  vec3 rr = normalize(sp);',
      '  vec3 d = vec3(dot(rr, Tu) / Wm, dot(rr, Tv) / Hm, max(1e-3, -dot(rr, Nn)) / 3.4);',
      '  float tx = abs(d.x) < 1e-5 ? 1e5 : (d.x > 0.0 ? (1.0 - luv.x) / d.x : -luv.x / d.x);',
      '  float ty = abs(d.y) < 1e-5 ? 1e5 : (d.y > 0.0 ? (1.0 - luv.y) / d.y : -luv.y / d.y);',
      '  float tz = 1.0 / d.z;',
      '  float t = min(min(tx, ty), tz);',
      '  vec3 hp = vec3(luv, 0.0) + d * t;',
      '  vec2 cb = cell / vec2(4.0, 2.0);',
      '  vec3 wallC = texture2D(emissiveMap, cb + vec2(0.08, 0.86) / vec2(4.0, 2.0)).rgb;',
      '  vec3 room;',
      '  if (t == tz) room = texture2D(emissiveMap, cb + (0.04 + clamp(hp.xy, 0.0, 1.0) * 0.92) / vec2(4.0, 2.0)).rgb;',
      '  else if (t == ty) room = d.y > 0.0 ? wallC * vec3(1.08, 1.04, 0.98) * (1.0 - 0.35 * hp.z) : vec3(0.42, 0.29, 0.19) * (0.75 + 0.35 * hp.z);',
      '  else room = wallC * (0.82 - 0.3 * hp.z);',
      '  room *= mix(1.0, 0.6, hp.z);',
      '  vec3 ct = texture2D(map, vMapUv).rgb;',
      '  float cm = smoothstep(0.1, 0.32, dot(ct, vec3(0.2126, 0.7152, 0.0722)));',
      '  diffuseColor.rgb = mix(vec3(0.012, 0.014, 0.016), ct * 0.82, cm * 0.55);',
      '  vec3 glow = room * (1.0 - cm * 0.45) + cm * 0.25 * wallC;',
      '  totalEmissiveRadiance *= glow;',
      '}',
      '#endif'
    ].join('\n');
    const roomGlass = (m) => {
      m.metalness = 0; m.roughness = 0.04; m.clearcoat = 0;
      if (!m.emissiveMap) { m.emissiveMap = T.interior; m.emissive = new THREE.Color(0xffffff); m.emissiveIntensity = 0.2; }
      m.onBeforeCompile = (sh) => { sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>', ROOM_GLSL); };
      m.customProgramCacheKey = () => 'pzRoomGlass';
    };
    ['glass', 'glassLit', 'glassLitB', 'glassLitC', 'glassDim'].forEach((k) => roomGlass(MAT[k]));
    const TILE = { kerb: 1.0, court: 3.2, courtP: 3.2, roofF: 3, roofM: 3, porc: 4.8, walnut: 2.4, stoneW: 3, stoneT: 2, water: 2.5, trav: 2, gFloor: 2, gConc: 2, deck: 1.6, plaster: 3, stone: 3.2, brick: 1.1, paving: 2.4, grass: 3, asphalt: 4, walk: 2.4, context: 4, slab: 2 };
    const NO_SHADOW = { kerb: 1, court: 1, courtP: 1, manhole: 1, gLamp: 1, gExit: 1, gAisle: 1, gStripe: 1, tail: 1, water: 1, zebra: 1, rail: 1, light: 1, glassLit: 1, glassLitB: 1, glassLitC: 1, glassDim: 1, glass: 1, grass: 1, asphalt: 1, walk: 1, paving: 1, board: 1, plinth: 1, brass: 1 };

    // ---------------------------------------------------------------- geometry buckets
    const GK = ['site', 'f0', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'roof', 'ctxN', 'ctxS', 'garage'];
    const GROUPS = {};
    GK.forEach((k) => { const g = new THREE.Group(); g.name = k; GROUPS[k] = g; scene.add(g); });
    const BUCKETS = {};
    let DRY = false;
    const put = (gk, mk, geo) => {
      if (mk.indexOf('glass') === 0 && geo.attributes.uv) {
        const cell = (rnd() * 8) | 0, cx = cell % 4, cy = (cell / 4) | 0, uv = geo.attributes.uv;
        for (let i = 0; i < uv.count; i++) uv.setXY(i, (cx + 0.04 + uv.getX(i) * 0.92) / 4, (cy + 0.04 + uv.getY(i) * 0.92) / 2);
      }
      if (DRY) return;
      const k = gk + '|' + mk;
      (BUCKETS[k] || (BUCKETS[k] = { gk: gk, mk: mk, list: [] })).list.push(geo);
    };
    const worldUV = (geo, tile) => {
      const p = geo.attributes.position, n = geo.attributes.normal, uv = geo.attributes.uv;
      for (let i = 0; i < p.count; i++) {
        const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i));
        let u, v;
        if (ax > 0.5) { u = p.getZ(i); v = p.getY(i); }
        else if (ay > 0.5) { u = p.getX(i); v = p.getZ(i); }
        else { u = p.getX(i); v = p.getY(i); }
        uv.setXY(i, u / tile, v / tile);
      }
    };
    const box = (gk, mk, x0, x1, y0, y1, z0, z1) => {
      if (x1 < x0) { const t = x0; x0 = x1; x1 = t; }
      if (y1 < y0) { const t = y0; y0 = y1; y1 = t; }
      if (z1 < z0) { const t = z0; z0 = z1; z1 = t; }
      const w = x1 - x0, h = y1 - y0, d = z1 - z0;
      if (w < 1e-3 || h < 1e-3 || d < 1e-3) return;
      const geo = new THREE.BoxGeometry(w, h, d);
      geo.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
      if (TILE[mk]) worldUV(geo, TILE[mk]);
      put(gk, mk, geo);
    };
    const quadZ = (gk, mk, x0, x1, y0, y1, z, dir, uRep) => {
      const geo = new THREE.PlaneGeometry(x1 - x0, y1 - y0);
      if (dir < 0) geo.rotateY(Math.PI);
      geo.translate((x0 + x1) / 2, (y0 + y1) / 2, z);
      if (uRep) { const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * (x1 - x0) / uRep); }
      put(gk, mk, geo);
    };
    const quadX = (gk, mk, z0, z1, y0, y1, x, dir, uRep) => {
      const geo = new THREE.PlaneGeometry(z1 - z0, y1 - y0);
      geo.rotateY(dir > 0 ? Math.PI / 2 : -Math.PI / 2);
      geo.translate(x, (y0 + y1) / 2, (z0 + z1) / 2);
      if (uRep) { const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * (z1 - z0) / uRep); }
      put(gk, mk, geo);
    };
    const quadY = (gk, mk, x0, x1, z0, z1, y, down) => {
      const geo = new THREE.PlaneGeometry(x1 - x0, z1 - z0);
      geo.rotateX(down ? Math.PI / 2 : -Math.PI / 2);
      geo.translate((x0 + x1) / 2, y, (z0 + z1) / 2);
      if (TILE[mk]) worldUV(geo, TILE[mk]);
      put(gk, mk, geo);
    };
    const sphere = (gk, mk, x, y, z, r, sy) => {
      const geo = new THREE.IcosahedronGeometry(r, 2);
      const pa = geo.attributes.position, ph = rnd() * 10;
      for (let i = 0; i < pa.count; i++) {
        const vx = pa.getX(i), vy = pa.getY(i), vz = pa.getZ(i);
        const k = 1 + 0.09 * Math.sin(vx / r * 5.1 + ph) * Math.cos(vz / r * 4.3 - ph) + 0.06 * Math.sin(vy / r * 6.7 + ph * 2.0);
        pa.setXYZ(i, vx * k, vy * k, vz * k);
      }
      geo.scale(1, sy || 0.85, 1);
      geo.rotateY(rnd() * 3);
      geo.translate(x, y, z);
      put(gk, mk, geo);
    };
    const blob = (gk, mk, x, y, z, r, sy, det) => {
      const geo = new THREE.IcosahedronGeometry(r, det === undefined ? 1 : det);
      geo.scale(1, sy || 0.8, 1);
      geo.translate(x, y, z);
      put(gk, mk, geo);
    };
    const FLW = ['flowerP', 'flowerW', 'flowerL', 'flowerW'];
    const flowers = (gk, x, y, z, spread, n) => {
      for (let i = 0; i < n; i++) cards(gk, x + (rnd() - 0.5) * spread, y + 0.08 + rnd() * 0.2, z + (rnd() - 0.5) * spread * 0.6, 0.16, 0.1, 0.12, 3, CELLS.flower, 0.16, 0.26);
    };
    const cyl = (gk, mk, x, y0, y1, z, r) => {
      const geo = new THREE.CylinderGeometry(r * 0.8, r, y1 - y0, 6);
      geo.translate(x, (y0 + y1) / 2, z);
      put(gk, mk, geo);
    };
    const merge = (list) => {
      let vc = 0, ic = 0;
      list.forEach((g) => { vc += g.attributes.position.count; ic += g.index ? g.index.count : g.attributes.position.count; });
      const pos = new Float32Array(vc * 3), nor = new Float32Array(vc * 3), uv = new Float32Array(vc * 2);
      const idx = vc > 65535 ? new Uint32Array(ic) : new Uint16Array(ic);
      let vo = 0, io = 0;
      list.forEach((g) => {
        const n = g.attributes.position.count;
        pos.set(g.attributes.position.array, vo * 3);
        nor.set(g.attributes.normal.array, vo * 3);
        if (g.attributes.uv) uv.set(g.attributes.uv.array, vo * 2);
        if (g.index) { const a = g.index.array; for (let i = 0; i < a.length; i++) idx[io + i] = a[i] + vo; io += a.length; }
        else { for (let i = 0; i < n; i++) idx[io + i] = vo + i; io += n; }
        vo += n;
        g.dispose();
      });
      const out = new THREE.BufferGeometry();
      out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
      out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
      out.setIndex(new THREE.BufferAttribute(idx, 1));
      out.computeBoundingSphere();
      return out;
    };

    // ---------------------------------------------------------------- building constants (metres, from the elevations)
    const X0 = -31, X1 = 31, ZF = 6.75, ZB = -6.75, LD = 1.5;
    const LV = [0, 4.48, 7.83, 11.18, 14.53, 17.88, 21.23, 24.28];
    const ROOF = 24.53;
    const SEG = [['A', -31, -25.9], ['B', -25.9, -8.3], ['C', -8.3, 9.1], ['D', 9.1, 26.5], ['E', 26.5, 31]];
    const BAYS6 = [[-11.5, -5.1], [14.45, 21.1]];
    // street fronts from the keyplan: base flush; floors 2-4 B projects 0.68 m and C/D 1.63 m over the sidewalk;
    // floor 5 back on the base line with terraces on the projections; floor 6 set back 1.82 m with two glass bays
    const frontZ = (f, seg) => {
      if (f <= 1 || seg === 'A') return ZF;
      if (f <= 4) return seg === 'B' ? ZF + 0.68 : (seg === 'C' || seg === 'D') ? ZF + 1.63 : ZF;
      if (f === 5) return ZF;
      return ZF - 1.82;
    };
    // the west wing (segment A) is shallower on the garden side
    const ZBA = (f) => (f === 0 ? -4.6 : f >= 6 ? -2.95 : -4.2);
    const segAt = (x) => { for (let i = 0; i < SEG.length; i++) if (x < SEG[i][2]) return SEG[i][0]; return 'E'; };
    const streetMat = (f, seg) => (f <= 1 ? 'stone' : (seg === 'A' || seg === 'C') ? 'brick' : 'plaster');
    const gardenMat = (f, x) => (f === 0 ? 'stone' : (x < -26.5 || (x > -8.3 && x < 9.1)) ? 'brick' : 'plaster');
    let litSeed = 7;
    // dry: replay the previous geometry's random draws without emitting it; iso: private random stream for added detail
    const dry = (fn) => { DRY = true; fn(); DRY = false; };
    const iso = (k, fn) => { const s = seed, l = litSeed; seed = 1 + (Math.abs(Math.round(k * 977)) % 2147483000); litSeed = 1 + (seed % 2147480000); fn(); seed = s; litSeed = l; };
    const hash01 = (a, b) => { const v = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return v - Math.floor(v); };
    const litPick = () => { litSeed = (litSeed * 48271) % 2147483647; const r = litSeed % 100; return r < 14 ? 'glassLit' : r < 26 ? 'glassLitB' : r < 36 ? 'glassLitC' : r < 60 ? 'glassDim' : 'glass'; };

    const rail = (gk, x0, x1, y0, y1, z, dir) => {
      quadZ(gk, 'rail', x0, x1, y0, y1, z, dir, 0.12);
      box(gk, 'frame', x0, x1, y1 - 0.05, y1 + 0.03, z - 0.04, z + 0.04);
      box(gk, 'frame', x0, x1, y0 + 0.06, y0 + 0.1, z - 0.02, z + 0.02);
      const nP = Math.max(1, Math.round((x1 - x0) / 1.4));
      for (let i = 0; i <= nP; i++) { const px = x0 + (x1 - x0) * i / nP; box(gk, 'frame', px - 0.025, px + 0.025, y0, y1, z - 0.025, z + 0.025); }
    };
    const railX = (gk, z0, z1, y0, y1, x, dir) => {
      quadX(gk, 'rail', z0, z1, y0, y1, x, dir, 0.12);
      box(gk, 'frame', x - 0.03, x + 0.03, y1 - 0.04, y1 + 0.02, z0, z1);
    };
    const pane = (gk, x0, x1, y0, y1, z, dir, o) => {
      o = o || {};
      quadZ(gk, o.mat || (o.lit === false ? 'glass' : o.lit ? 'glassLit' : litPick()), x0, x1, y0, y1, z, dir);
      const t = 0.06, z1 = z + dir * 0.07;
      box(gk, 'frame', x0 - t, x1 + t, y1, y1 + t, z, z1);
      box(gk, 'frame', x0 - t, x1 + t, y0 - t, y0, z, z1);
      box(gk, 'frame', x0 - t, x0, y0, y1, z, z1);
      box(gk, 'frame', x1, x1 + t, y0, y1, z, z1);
      const mw = o.mull || 0.95;
      const n = Math.max(1, Math.round((x1 - x0) / mw));
      for (let i = 1; i < n; i++) { const xm = x0 + (x1 - x0) * i / n; box(gk, 'frame', xm - 0.025, xm + 0.025, y0, y1, z, z + dir * 0.045); }
      if (o.transom) box(gk, 'frame', x0, x1, o.transom - 0.03, o.transom + 0.03, z, z + dir * 0.045);
    };
    const paneX = (gk, z0, z1, y0, y1, x, dir) => {
      quadX(gk, litPick(), z0, z1, y0, y1, x, dir);
      const t = 0.06, x1 = x + dir * 0.07;
      box(gk, 'frame', x, x1, y1, y1 + t, z0 - t, z1 + t);
      box(gk, 'frame', x, x1, y0 - t, y0, z0 - t, z1 + t);
      box(gk, 'frame', x, x1, y0, y1, z0 - t, z0);
      box(gk, 'frame', x, x1, y0, y1, z1, z1 + t);
      box(gk, 'frame', x, x + dir * 0.045, y0, y1, (z0 + z1) / 2 - 0.025, (z0 + z1) / 2 + 0.025);
    };
    // leaf cards: alpha-tested quads with soft "volume" normals, merged per bucket
    const CELLS = { leaf: [0, 1, 2], dark: [0, 0, 1], light: [1, 2, 2], flower: [3, 4, 5, 3], grass: [6], olive: [7] };
    const cards = (gk, cx, cy, cz, rx, ry, rz, n, cells, s0, s1, o) => {
      o = o || {};
      const pos = [], nor = [], uv = [], idx = [];
      const V = new THREE.Vector3(), N = new THREE.Vector3(), Q = new THREE.Quaternion(), E = new THREE.Euler();
      for (let i = 0; i < n; i++) {
        let px, py, pz;
        do { px = rnd() * 2 - 1; py = rnd() * 2 - 1; pz = rnd() * 2 - 1; } while (px * px + py * py + pz * pz > 1);
        const shell = o.shell ? 0.75 + 0.25 * rnd() : 1;
        if (o.shell) { const l = Math.hypot(px, py, pz) || 1; px /= l; py /= l; pz /= l; }
        px *= rx * shell; py *= ry * shell; pz *= rz * shell;
        const sz = s0 + rnd() * (s1 - s0);
        const vert = o.upright;
        E.set(vert ? (rnd() - 0.5) * 0.25 : (rnd() - 0.5) * 2.4, rnd() * 6.283, vert ? (rnd() - 0.5) * 0.3 : (rnd() - 0.5) * 1.2, 'YXZ');
        Q.setFromEuler(E);
        const c = cells[(rnd() * cells.length) | 0], u0 = (c % 4) / 4, v0 = 1 - (((c / 4) | 0) + 1) / 2;
        const base = pos.length / 3;
        const corners = vert ? [[-0.5, 0], [0.5, 0], [0.5, 1], [-0.5, 1]] : [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]];
        const uvs = [[0, 0], [1, 0], [1, 1], [0, 1]];
        corners.forEach((q, k) => {
          V.set(q[0] * sz, q[1] * sz, 0).applyQuaternion(Q);
          const X = cx + px + V.x, Y = cy + py + V.y, Z = cz + pz + V.z;
          pos.push(X, Y, Z);
          N.set((X - cx) / Math.max(rx, 0.05), (Y - cy) / Math.max(ry, 0.05) + 0.55, (Z - cz) / Math.max(rz, 0.05)).normalize();
          nor.push(N.x, N.y, N.z);
          uv.push(u0 + (0.012 + uvs[k][0] * 0.976) / 4, v0 + (0.012 + uvs[k][1] * 0.976) / 2);
        });
        idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      geo.setIndex(idx);
      put(gk, 'fol', geo);
    };
    const shrub = (gk, x, y, z, r, h, flowerP) => {
      cards(gk, x, y + h * 0.5, z, r * 1.1, h * 0.6, r * 0.9, Math.round(14 + r * h * 40), CELLS.leaf, 0.3, 0.56);
      if (rnd() < flowerP) cards(gk, x, y + h * 0.75, z, r * 0.8, h * 0.35, r * 0.7, Math.round(5 + r * 10), CELLS.flower, 0.22, 0.38);
    };
    const topiary = (gk, x, y, z, r) => { cyl(gk, 'trunk', x, y, y + r * 0.6, z, 0.035); cards(gk, x, y + r * 0.6 + r, z, r, r, r, Math.round(60 * r * r + 18), CELLS.dark, 0.22, 0.34, { shell: true }); };
    // long planter with mixed shrubs, flowers, grasses and a few trailing leaves
    const plantBed = (gk, x0, x1, y, zc, depth, opt) => {
      opt = opt || {};
      const h = opt.h || 0.45, axis = opt.axis || 'x';
      if (axis === 'x') box(gk, 'planter', x0, x1, y, y + h, zc - depth / 2, zc + depth / 2);
      else box(gk, 'planter', zc - depth / 2, zc + depth / 2, y, y + h, x0, x1);
      const L = x1 - x0, top = y + h, step = opt.step || 0.6;
      for (let t = 0.3; t < L - 0.2; t += step * (0.75 + rnd() * 0.5)) {
        const a = x0 + t, r = 0.28 + rnd() * 0.22, hh = (opt.tall || 0.6) * (0.7 + rnd() * 0.6);
        const kind = rnd();
        const X = axis === 'x' ? a : zc + (rnd() - 0.5) * depth * 0.4, Z = axis === 'x' ? zc + (rnd() - 0.5) * depth * 0.4 : a;
        if (kind < (opt.topiary || 0)) topiary(gk, X, top, Z, 0.32 + rnd() * 0.12);
        else if (kind < (opt.topiary || 0) + 0.08) cards(gk, X, top - 0.05, Z, 0.22, 0.6, 0.18, 9, CELLS.grass, 0.55, 0.9, { upright: true });
        else shrub(gk, X, top - 0.08, Z, r, hh, opt.flowers === undefined ? 0.45 : opt.flowers);
        if (opt.trail && rnd() < 0.55) {
          const tx = axis === 'x' ? a : zc + opt.trail * depth / 2, tz = axis === 'x' ? zc + opt.trail * depth / 2 : a;
          cards(gk, tx, top - 0.35, tz, 0.22, 0.38, 0.12, 8, CELLS.leaf, 0.2, 0.34);
        }
      }
    };
    const limb = (gk, mk, ax, ay, az, bx, by, bz, r0, r1) => {
      const d = new THREE.Vector3(bx - ax, by - ay, bz - az), len = d.length();
      const geo = new THREE.CylinderGeometry(r1, r0, len, 7);
      geo.translate(0, len / 2, 0);
      geo.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()));
      geo.translate(ax, ay, az);
      put(gk, mk, geo);
    };
    // tapered tube along a smooth path (trunks and limbs): the cross-section is lobed and twists as it rises, the foot flares
    const V3 = (a, b, c) => new THREE.Vector3(a, b, c);
    const tube = (gk, mk, pts, r0, r1, flute, flare, seg, rad) => {
      const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal'), fr = curve.computeFrenetFrames(seg, false), L = curve.getLength();
      const pos = [], uv = [], idx = [], ph = rnd() * 6.283, wrap = Math.max(1, Math.round(r0 * 14));
      for (let i = 0; i <= seg; i++) {
        const t = i / seg, P = curve.getPointAt(t), N = fr.normals[i], B = fr.binormals[i];
        const r = (r0 + (r1 - r0) * Math.pow(t, 0.8)) * (1 + flare * Math.pow(1 - t, 7));
        for (let j = 0; j <= rad; j++) {
          const a = j / rad * 6.283185, k = 1 + flute * (0.6 * Math.sin(3 * a + t * 7 + ph) + 0.4 * Math.sin(5 * a - t * 11 + ph * 2));
          const cx = Math.cos(a) * r * k, sx = Math.sin(a) * r * k;
          pos.push(P.x + N.x * cx + B.x * sx, P.y + N.y * cx + B.y * sx, P.z + N.z * cx + B.z * sx); uv.push(j / rad * wrap, t * L / 0.9);
        }
      }
      for (let i = 0; i < seg; i++) for (let j = 0; j < rad; j++) { const a = i * (rad + 1) + j, b = a + rad + 1; idx.push(a, a + 1, b, b, a + 1, b + 1); }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
      put(gk, mk, geo);
    };
    // olive: short leaning trunk with a flared, furrowed foot, three curved limbs, a wide umbrella crown of silver clumps;
    // plane / broadleaf: straight trunk, four limbs, a tall rounded crown
    const tree = (gk, x, y, z, h, r, kind, lite) => {
      const olive = kind === 'olive', lean = rnd() * 6.283, lx = Math.cos(lean), lz = Math.sin(lean);
      const th = h * (olive ? 0.32 : 0.46), tr0 = olive ? Math.max(0.07, h * 0.05) : Math.max(0.09, r * 0.085), tr1 = tr0 * (olive ? 0.66 : 0.72);
      const off = olive ? 0.32 * h / 5 : 0.12;
      const F = V3(x + lx * off, y + th, z + lz * off);
      const bk = kind === 'plane' ? 'trunkP' : 'trunk';
      tube(gk, bk, [V3(x, y - 0.05, z), V3(x + lx * off * 0.15 + (rnd() - 0.5) * 0.08, y + th * 0.35, z + lz * off * 0.15 + (rnd() - 0.5) * 0.08), V3(x + lx * off * 0.6, y + th * 0.72, z + lz * off * 0.6), F], tr0, tr1, olive ? 0.22 : 0.07, olive ? 0.55 : 0.35, 14, olive ? 10 : 8);
      // crown = many small clumps with gaps between them (an irregular silhouette, not a ball): one at each limb end, two
      // more around it, a crown top and a little inner fill; card normals point out of their own clump, so light varies
      const k = olive ? 3 : 4, cells = olive ? CELLS.olive : CELLS.leaf, crownY = y + th + (h - th) * (olive ? 0.42 : 0.5);
      const cl = (cx, cy, cz, rr) => cards(gk, cx, cy, cz, rr, rr * (olive ? 0.62 : 0.78), rr, Math.round((30 * rr + 8) * (lite ? 0.55 : 1)), cells, r * (lite ? 0.32 : 0.26), r * (lite ? 0.56 : 0.46));
      for (let i = 0; i < k; i++) {
        const a = lean + i / k * 6.283 + (rnd() - 0.5) * 0.7, ca = Math.cos(a), sa = Math.sin(a);
        const E = V3(F.x + ca * r * 0.6, crownY + (rnd() - 0.4) * r * 0.35, F.z + sa * r * 0.6);
        tube(gk, bk, [F, F.clone().lerp(E, 0.5).add(V3(0, 0.22 * r, 0)), E], tr1 * 0.6, tr1 * 0.24, 0.08, 0, 8, 6);
        cl(E.x, E.y + r * 0.06, E.z, r * 0.44);
        for (let q = 0; q < 2; q++) { const b = a + (q ? 0.55 : -0.55) + (rnd() - 0.5) * 0.3, d = r * (0.42 + rnd() * 0.3); cl(F.x + Math.cos(b) * d, E.y + (rnd() - 0.3) * r * 0.45, F.z + Math.sin(b) * d, r * (0.3 + rnd() * 0.1)); }
      }
      cl(F.x + (rnd() - 0.5) * r * 0.3, y + h - r * (olive ? 0.42 : 0.55), F.z + (rnd() - 0.5) * r * 0.3, r * 0.48);
      cards(gk, F.x, crownY, F.z, r * 0.45, r * 0.3, r * 0.45, Math.round(12 * r + 5), olive ? cells : CELLS.dark, r * 0.28, r * 0.46);   // inner fill
    };
    const hedge = (gk, x0, x1, y0, y1, z0, z1) => {
      box(gk, 'leaf2', x0 + 0.08, x1 - 0.08, y0, y1 - 0.12, z0 + 0.08, z1 - 0.08);
      const vol = (x1 - x0) * (y1 - y0) * (z1 - z0), n = Math.round(Math.min(900, 30 * vol + 20));
      cards(gk, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, (x1 - x0) / 2, (y1 - y0) / 2, (z1 - z0) / 2, n, CELLS.dark, 0.3, 0.5, { shell: true });
    };
    const clusters = (gk, x0, x1, y, z, depth, opt) => {
      let c = x0 + 0.4 + rnd() * 1.2;
      while (c < x1 - 0.6) {
        const len = 1.5 + rnd() * 1.4, e = Math.min(x1, c + len);
        plantBed(gk, c, e, y, z, depth, opt);
        c = e + 0.9 + rnd() * 1.4;
      }
    };
    const oliveRow = (gk, a0, a1, y, c, axis) => {
      const L = a1 - a0, n = Math.max(1, Math.round(L / 4.4)), st = L / n;
      for (let i = 0; i < n; i++) {
        const m = a0 + (i + 0.5) * st, px = axis === 'z' ? c : m, pz = axis === 'z' ? m : c;
        box(gk, 'planter', px - 0.42, px + 0.42, y, y + 0.55, pz - 0.42, pz + 0.42);
        tree(gk, px, y + 0.55, pz, 2.1 + rnd() * 0.6, 0.62 + rnd() * 0.18, 'olive');
        if (i < n - 1 && rnd() < 0.45) { const q = m + st * 0.5, o = { h: 0.42, tall: 0.7, flowers: 0.3, step: 0.4, topiary: 0.25 }; if (axis === 'z') plantBed(gk, q - 0.6, q + 0.6, y, c, 0.55, Object.assign({ axis: 'z' }, o)); else plantBed(gk, q - 0.6, q + 0.6, y, c, 0.55, o); }
      }
    };
    const shrubRow = (gk, x0, x1, y, z) => plantBed(gk, x0, x1, y, z, 0.5, { trail: 1, topiary: 0.12 });

    // a few planters per loggia (the renders show potted plants, not a continuous hedge)
    const pots = (gk, x0, x1, y, zc, dir) => {
      const L = x1 - x0, n = Math.max(1, Math.round(L / 2.4));
      for (let i = 0; i < n; i++) {
        if (n > 2 && rnd() < 0.08) continue;
        const c = x0 + (i + 0.5) * L / n + (rnd() - 0.5) * 0.4, hl = 0.45 + rnd() * 0.3;
        plantBed(gk, Math.max(x0, c - hl), Math.min(x1, c + hl), y, zc, 0.46, { h: 0.42, trail: dir, tall: 0.85, topiary: 0.2, flowers: 0.5, step: 0.34 });
      }
    };
    const spill = (gk, x0, x1, ytop, z, dir) => {
      let c = x0 + 0.2 + rnd() * 0.6;
      while (c < x1 - 0.3) {
        const hw = 0.22 + rnd() * 0.3, drop = 0.35 + rnd() * 0.55;
        cards(gk, c, ytop - drop / 2, z + dir * 0.05, hw, drop / 2, 0.06, Math.round(18 + 40 * hw * drop), CELLS.leaf, 0.12, 0.24);
        if (rnd() < 0.45) flowers(gk, c, ytop - drop * 0.4, z + dir * 0.07, hw * 1.4, 2 + ((rnd() * 3) | 0));
        c += hw * 2 + 0.5 + rnd() * 1.4;
      }
    };
    const LIT = ['glassLit', 'glassLitB', 'glassLitC'];
    const loggia = (gk, x0, x1, yb, yt, fz, dir, mk, o) => {
      o = o || {};
      const zb = fz - dir * LD;
      box(gk, 'slab', x0, x1, yb, yb + 0.2, fz, zb);
      box(gk, mk, x0, x1, yt - 0.34, yt, fz, zb);
      // projecting box frame (renders W958 laterale / frontale): side cheeks and a deep slab nose stand proud of the
      // facade so every loggia reads as a framed box; a dark drip groove under the nose
      { const cw = 0.24, zf = fz + dir * 0.22, za = Math.min(fz, zf), zz = Math.max(fz, zf);
        box(gk, mk, x0 - cw, x0, yb - 0.16, yt, za, zz);
        box(gk, mk, x1, x1 + cw, yb - 0.16, yt, za, zz);
        box(gk, mk, x0, x1, yb - 0.16, yb + 0.2, za, zz);
        box(gk, 'soffit', x0, x1, yb - 0.17, yb - 0.16, zf - dir * 0.07, zf - dir * 0.04); }
      if (o.deep) {
        // recessed loggia: warm soffit downlights, dark frame on the back wall, lit interior per apartment
        const zc = (fz + zb) / 2, nd = Math.max(1, Math.round((x1 - x0) / 1.6));
        for (let i = 0; i < nd; i++) { const cx = x0 + (i + 0.5) * (x1 - x0) / nd; quadY(gk, 'light', cx - 0.09, cx + 0.09, zc - 0.09, zc + 0.09, yt - 0.345, true); }
        box(gk, 'frame', x0, x1, yt - 0.62, yt - 0.34, Math.min(zb, zb + dir * 0.04), Math.max(zb, zb + dir * 0.04));
        const m = rnd() < 0.5 ? LIT[Math.floor(rnd() * 3)] : undefined;
        const n = Math.max(1, Math.round((x1 - x0) / 1.5)), pw = (x1 - x0 - 0.2) / n;
        for (let i = 0; i < n; i++) {
          const a = x0 + 0.1 + i * pw;
          pane(gk, a + 0.04, a + pw - 0.04, yb + 0.22, yt - 0.62, zb + dir * 0.015, dir, { mat: m });
          box(gk, 'frame', a - 0.035, a + 0.035, yb + 0.2, yt - 0.62, Math.min(zb, zb + dir * 0.06), Math.max(zb, zb + dir * 0.06));
        }
        box(gk, 'frame', x1 - 0.135, x1 - 0.065, yb + 0.2, yt - 0.62, Math.min(zb, zb + dir * 0.06), Math.max(zb, zb + dir * 0.06));
        rail(gk, x0 + 0.03, x1 - 0.03, yb + 0.2, yb + 1.1, fz - dir * 0.05, dir);
        if (rnd() < 0.88) { pots(gk, x0 + 0.3, x1 - 0.3, yb + 0.2, zb + dir * 0.4, dir); if (rnd() < 0.6) spill(gk, x0 + 0.2, x1 - 0.2, yb + 1.1, fz, dir); }
        return;
      }
      { const zc = (fz + zb) / 2, nd = Math.max(1, Math.round((x1 - x0) / 1.8)); for (let i = 0; i < nd; i++) { const cx = x0 + (i + 0.5) * (x1 - x0) / nd; quadY(gk, 'light', cx - 0.08, cx + 0.08, zc - 0.08, zc + 0.08, yt - 0.345, true); } }
      box(gk, 'soffit', x0, x1, yt - 0.36, yt - 0.34, Math.min(fz, zb), Math.max(fz, zb));
      const n = Math.max(1, Math.round((x1 - x0) / 2.0));
      const pw = (x1 - x0) / n;
      for (let i = 0; i < n; i++) pane(gk, x0 + i * pw + 0.3, x0 + (i + 1) * pw - 0.3, yb + 0.22, yt - 0.62, zb + dir * 0.015, dir, { mull: 0.8 });
      if (dir === 1) {
        // street side: the balcony slab cantilevers 1.25 m out of the box frame (renders W958 frontale / laterale),
        // bar railing on three sides, planters along the front edge
        const zo = fz + 1.5;
        box(gk, 'plaster', x0 - 0.06, x1 + 0.06, yb - 0.26, yb + 0.2, fz + 0.22, zo);
        box(gk, 'soffit', x0 + 0.02, x1 - 0.02, yb - 0.27, yb - 0.26, fz + 0.22, zo - 0.03);
        box(gk, 'soffit', x0, x1, yb - 0.275, yb - 0.265, zo - 0.07, zo - 0.04);
        rail(gk, x0 + 0.03, x1 - 0.03, yb + 0.2, yb + 1.2, zo - 0.05, 1);
        railX(gk, fz + 0.22, zo - 0.05, yb + 0.2, yb + 1.2, x0 + 0.03, -1);
        railX(gk, fz + 0.22, zo - 0.05, yb + 0.2, yb + 1.2, x1 - 0.03, 1);
        if (rnd() < 0.85) { pots(gk, x0 + 0.25, x1 - 0.25, yb + 0.2, zo - 0.4, 1); spill(gk, x0 + 0.2, x1 - 0.2, yb + 1.2, zo, 1); }
      } else {
        rail(gk, x0 + 0.03, x1 - 0.03, yb + 0.2, yb + 1.2, fz - dir * 0.08, dir);
        if (rnd() < 0.85) { pots(gk, x0 + 0.25, x1 - 0.25, yb + 0.2, fz - dir * 0.42, dir); spill(gk, x0 + 0.2, x1 - 0.2, yb + 1.2, fz, dir); }
      }
    };
    const surround = (gk, mk, x0, x1, y0, y1, fz, dir) => {
      const s = 0.13, o = 0.08, zz = fz + dir * 0.09;
      box(gk, mk, x0 - s - o, x1 + s + o, y1 + o, y1 + o + s, fz, zz);
      box(gk, mk, x0 - s - o, x1 + s + o, y0 - o - s, y0 - o, fz, zz);
      box(gk, mk, x0 - s - o, x0 - o, y0 - o, y1 + o, fz, zz);
      box(gk, mk, x1 + o, x1 + o + s, y0 - o, y1 + o, fz, zz);
    };
    const REC = 0.3;
    const holeOf = (w, yb, yt) => ({ x0: w.x0 - 0.06, x1: w.x1 + 0.06, y0: yb + 0.08, y1: yt - 0.54 });
    const holedWall = (gk, mkAt, x0, x1, yb, yt, z0, z1, holes, cuts) => {
      const pieces = [];
      let cur = x0;
      holes.filter((h) => h.x1 > x0 && h.x0 < x1).sort((a, b) => a.x0 - b.x0).forEach((h) => {
        const hx0 = Math.max(x0, h.x0), hx1 = Math.min(x1, h.x1);
        if (hx0 > cur + 1e-3) pieces.push([cur, hx0, yb, yt]);
        if (h.y0 > yb + 1e-3) pieces.push([hx0, hx1, yb, h.y0]);
        if (h.y1 < yt - 1e-3) pieces.push([hx0, hx1, h.y1, yt]);
        cur = Math.max(cur, hx1);
      });
      if (x1 > cur + 1e-3) pieces.push([cur, x1, yb, yt]);
      pieces.forEach((q) => {
        const cs = (cuts || []).filter((c) => c > q[0] + 1e-3 && c < q[1] - 1e-3).concat([q[1]]);
        let a = q[0];
        cs.forEach((c) => { box(gk, mkAt((a + c) / 2), a, c, q[2], q[3], z0, z1); a = c; });
      });
    };
    const windowZ = (gk, w, yb, yt, fz, dir, mk) => {
      const h = holeOf(w, yb, yt), rz = fz - dir * REC;
      pane(gk, w.x0, w.x1, h.y0 + 0.06, h.y1 - 0.06, rz, dir);
      const fz0 = rz + dir * 0.005, fz1 = rz + dir * 0.06, py0 = h.y0 + 0.06, py1 = h.y1 - 0.06;
      box(gk, 'frame', w.x0, w.x1, py1 - 0.07, py1, Math.min(fz0, fz1), Math.max(fz0, fz1));
      box(gk, 'frame', w.x0, w.x0 + 0.07, py0, py1, Math.min(fz0, fz1), Math.max(fz0, fz1));
      box(gk, 'frame', w.x1 - 0.07, w.x1, py0, py1, Math.min(fz0, fz1), Math.max(fz0, fz1));
      if (w.x1 - w.x0 > 1.05) { const mx = (w.x0 + w.x1) / 2; box(gk, 'frame', mx - 0.035, mx + 0.035, py0, py1, Math.min(fz0, fz1), Math.max(fz0, fz1)); }
      if (py1 - py0 > 2.1) box(gk, 'frame', w.x0, w.x1, py1 - 0.5, py1 - 0.44, Math.min(fz0, fz1), Math.max(fz0, fz1));
      box(gk, 'slab', h.x0 - 0.04, h.x1 + 0.04, h.y0 - 0.05, h.y0 + 0.02, rz, fz + dir * 0.05);
      if (w.fb) rail(gk, h.x0 + 0.03, h.x1 - 0.03, h.y0 + 0.02, yb + 1.1, fz - dir * 0.06, dir);
      if (w.bal) {
        const bz = fz + dir * 1.3, a = w.x0 - 0.5, b = w.x1 + 0.5;
        box(gk, 'slab', a, b, yb - 0.06, yb + 0.16, fz, bz);
        box(gk, 'frame', a, b, yb - 0.09, yb - 0.06, Math.min(bz - dir * 0.08, bz), Math.max(bz - dir * 0.08, bz));
        rail(gk, a, b, yb + 0.16, yb + 1.2, bz - dir * 0.04, dir);
        railX(gk, Math.min(fz, bz), Math.max(fz, bz), yb + 0.16, yb + 1.2, a + 0.03, -1);
        railX(gk, Math.min(fz, bz), Math.max(fz, bz), yb + 0.16, yb + 1.2, b - 0.03, 1);
        if (rnd() < 0.8) pots(gk, a + 0.2, b - 0.2, yb + 0.16, bz - dir * 0.35, dir);
      }
    };
    const windowZOld = (gk, w, yb, yt, fz, dir, mk) => {
      const y0 = yb + 0.14, y1 = yt - 0.6;
      pane(gk, w.x0, w.x1, y0, y1, fz + dir * 0.012, dir);
      if (mk === 'brick') box(gk, 'slab', w.x0 - 0.12, w.x1 + 0.12, y0 - 0.12, y0 - 0.02, fz, fz + dir * 0.14);
      else surround(gk, mk, w.x0, w.x1, y0, y1, fz, dir);
      if (w.fb) rail(gk, w.x0, w.x1, yb + 0.14, yb + 1.1, fz + dir * 0.2, dir);
      if (w.bal) {
        const bz = fz + dir * 1.3, a = w.x0 - 0.5, b = w.x1 + 0.5;
        box(gk, 'slab', a, b, yb - 0.06, yb + 0.16, fz, bz);
        box(gk, 'frame', a, b, yb - 0.09, yb - 0.06, Math.min(bz - dir * 0.08, bz), Math.max(bz - dir * 0.08, bz));
        rail(gk, a, b, yb + 0.16, yb + 1.2, bz - dir * 0.04, dir);
        railX(gk, Math.min(fz, bz), Math.max(fz, bz), yb + 0.16, yb + 1.2, a + 0.03, -1);
        railX(gk, Math.min(fz, bz), Math.max(fz, bz), yb + 0.16, yb + 1.2, b - 0.03, 1);
      }
    };

    // street openings (from the street elevation)
    const streetOpenings = (f, seg, s0, s1) => {
      const o = [];
      const win = (cx, w, extra) => o.push(Object.assign({ t: 'w', x0: cx - w / 2, x1: cx + w / 2 }, extra || {}));
      const log = (a, b) => o.push({ t: 'l', x0: a, x1: b });
      if (seg === 'A') { win(-29.55, 1.3, { fb: true }); win(-27.25, 1.3, { fb: true }); return o; }
      if (f === 5 && seg === 'E') { win(27.8, 1.4, { fb: true }); log(29.1, 31.0); return o; }
      if (f <= 4) {
        if (f === 1) {
          if (seg === 'B') { [-23.5, -20.3, -17.1, -13.9, -10.7].forEach((cx) => win(cx, 1.6, {})); }
          if (seg === 'C') { [-6.3, -3.2, 0.4, 3.9, 7.1].forEach((cx) => win(cx, 1.6, {})); }
          if (seg === 'D') { [10.8, 14.0, 17.4, 20.8, 24.2].forEach((cx) => win(cx, 1.6, {})); }
          if (seg === 'E') { win(28.6, 1.6, {}); }
          return o;
        }
        if (seg === 'B') { log(-25.1, -20.4); win(-18.6, 1.7, { fb: true }); win(-15.1, 1.7, { fb: true }); log(-13.3, -8.3); }
        if (seg === 'C') { win(-6.45, 1.5, { fb: true }); log(-4.6, 5.5); win(7.3, 1.5, { fb: true }); }
        if (seg === 'D') { win(10.9, 1.6, { fb: true }); log(12.7, 22.8); win(24.65, 1.6, { fb: true }); }
        if (seg === 'E') { win(27.8, 1.4, { fb: true }); log(29.1, 31.0); }
        return o;
      }
      const step = f === 5 ? 3.1 : 3.3, w = f === 5 ? 1.6 : 1.75;
      for (let cx = s0 + step / 2; cx < s1 - 0.5; cx += step) {
        if (f === 6 && BAYS6.some((b) => cx > b[0] - 0.9 && cx < b[1] + 0.9)) continue;
        win(cx, w, {});
      }
      return o;
    };

    const streetFloor = (f) => {
      const gk = 'f' + f, yb = LV[f], yt = LV[f + 1];
      SEG.forEach((s) => {
        const seg = s[0], s0 = s[1], s1 = s[2];
        const fz = frontZ(f, seg), mk = streetMat(f, seg);
        const ops = streetOpenings(f, seg, s0, s1).sort((a, b) => a.x0 - b.x0);
        box(gk, 'inner', s0, s1, yb, yt, (seg === 'A' ? ZBA(f) : ZB) + LD, fz - LD);
        // soffit band under the projecting floors
        if (f === 2 && fz > ZF + 0.1) { box(gk, 'slab', s0, s1, yb - 0.24, yb + 0.02, ZF, fz); }
        const wins = ops.filter((o) => o.t === 'w'), holes = wins.map((w) => holeOf(w, yb, yt));
        let cur = s0;
        ops.filter((o) => o.t === 'l').forEach((l) => {
          holedWall(gk, () => mk, cur, l.x0, yb, yt, fz - LD, fz, holes);
          loggia(gk, l.x0, l.x1, yb, yt, fz, 1, mk);
          cur = l.x1;
        });
        holedWall(gk, () => mk, cur, s1, yb, yt, fz - LD, fz, holes);
        wins.forEach((w) => windowZ(gk, w, yb, yt, fz, 1, mk));
      });
    };

    const baseStreet = (f) => {
      const gk = 'f' + f, yb = LV[f], yt = LV[f + 1];
      if (f === 0) { box(gk, 'inner', X0, X1, yb, yt, -4.3, ZF - LD); box(gk, 'inner', -14.5, 14.5, yb, yt, -6.2, -4.3); }
      else { box(gk, 'inner', X0, -25.9, yb, yt, ZBA(f) + LD, ZF - LD); box(gk, 'inner', -25.9, X1, yb, yt, ZB + LD, ZF - LD); }
      const n = 18, bw = (X1 - X0) / n, w = 2.3, holes = [], rz = ZF - 0.3;
      for (let i = 0; i < n; i++) {
        const cx = X0 + bw * (i + 0.5), door = f === 0 && (i === 8 || i === 9);
        const y0 = f === 0 ? (door ? 0.02 : 0.55) : yb + 0.4, y1 = f === 0 ? 3.75 : yt - 0.45;
        holes.push({ x0: cx - w / 2 - 0.08, x1: cx + w / 2 + 0.08, y0: y0 - 0.06, y1: y1 + 0.08 });
        const lob = f === 0 && i >= 7 && i <= 10;
        pane(gk, cx - w / 2, cx + w / 2, y0, y1, rz, 1, { mull: 1.15, transom: f === 0 ? (door ? 2.9 : 2.75) : yb + 1.35, mat: lob ? 'lobbyGlass' : undefined });
        if (!door) box(gk, 'slab', cx - w / 2 - 0.1, cx + w / 2 + 0.1, y0 - 0.12, y0 - 0.04, rz, ZF + 0.04);
        else box(gk, 'slab', cx - w / 2 - 0.08, cx + w / 2 + 0.08, -0.02, 0.02, rz - 0.4, ZF + 0.6);
      }
      holedWall(gk, () => 'stone', X0, X1, yb, yt, ZF - LD, ZF, holes);
      if (f === 0) box(gk, 'stone', X0, X1, 3.81, LV[1] + 0.36, ZF, ZF + 0.08);
      if (f === 1) box(gk, 'slab', X0 - 0.05, X1 + 0.05, yt - 0.2, yt, ZF, ZF + 0.22);
    };

    const GBAY = 3.1;
    // garden loggias from the keyplan (x ranges per floor)
    const GLOG = {
      1: [[-23.0, -14.1], [-11.3, -5.1], [-2.3, 3.2], [6.0, 12.2], [15.0, 25.3]],
      5: [[-23.0, -13.9], [-13.9, 0.5], [0.5, 14.8], [14.8, 25.3]],
      6: [[-19.6, -17.1], [-2.3, 6.2], [15.0, 20.6]]
    };
    // split long keyplan loggias into individual recessed bays separated by solid piers
    const GPIER = 0.6, GMAXW = 4.2;
    const gardenBays = (L) => {
      const out = [];
      L.forEach((l, i) => {
        const a = l[0] + (i > 0 && Math.abs(L[i - 1][1] - l[0]) < 0.05 ? GPIER / 2 : 0);
        const b = l[1] - (i < L.length - 1 && Math.abs(L[i + 1][0] - l[1]) < 0.05 ? GPIER / 2 : 0);
        const n = Math.max(1, Math.ceil((b - a + GPIER) / (GMAXW + GPIER))), w = (b - a - (n - 1) * GPIER) / n;
        for (let k = 0; k < n; k++) out.push({ t: 'l', x0: a + k * (w + GPIER), x1: a + k * (w + GPIER) + w });
      });
      return out;
    };
    const gardenOpenings = (f) => {
      const L = GLOG[f] || GLOG[1];
      const o = L.map((l) => ({ t: 'l', x0: l[0], x1: l[1] }));
      let a = -25.9;
      L.concat([[X1, X1]]).forEach((l) => {
        const span = l[0] - a;
        const n = Math.floor((span + 0.4) / GBAY);
        for (let i = 0; i < n; i++) { const cx = a + span * (i + 0.5) / n; o.push({ t: 'w', x0: cx - 0.72, x1: cx + 0.72, fb: true }); }
        a = l[1];
      });
      return o.sort((p, q) => p.x0 - q.x0);
    };
    const wallRunG = (gk, f, a, b, yb, yt) => {
      const cuts = [-26.5, -8.3, 9.1].filter((c) => c > a && c < b).concat([b]);
      let s = a;
      cuts.forEach((c) => { box(gk, gardenMat(f, (s + c) / 2), s, c, yb, yt, ZB, ZB + LD); s = c; });
    };
    const gardenFloor = (f) => {
      const gk = 'f' + f, yb = LV[f], yt = LV[f + 1], za = ZBA(f);
      // west wing: garden face set back to za, return wall at x = -25.9
      const winsA = [{ x0: -30.3, x1: -28.9, fb: true }, { x0: -28.0, x1: -26.6, fb: true }];
      holedWall(gk, () => 'brick', X0, -25.9, yb, yt, za, za + LD, winsA.map((w) => holeOf(w, yb, yt)));
      winsA.forEach((w) => windowZ(gk, w, yb, yt, za, -1, 'brick'));
      box(gk, 'brick', -26.2, -25.9, yb, yt, ZB, za + LD);
      const ops = gardenOpenings(f);
      const wins = ops.filter((o) => o.t === 'w'), holes = wins.map((w) => holeOf(w, yb, yt));
      const mkAt = (x) => gardenMat(f, x), cuts = [-26.5, -8.3, 9.1];
      let cur = -25.9;
      ops.filter((o) => o.t === 'l').forEach((l) => {
        holedWall(gk, mkAt, cur, l.x0, yb, yt, ZB, ZB + LD, holes, cuts);
        loggia(gk, l.x0, l.x1, yb, yt, ZB, -1, gardenMat(f, (l.x0 + l.x1) / 2));
        cur = l.x1;
      });
      holedWall(gk, mkAt, cur, X1, yb, yt, ZB, ZB + LD, holes, cuts);
      wins.forEach((w) => windowZ(gk, w, yb, yt, ZB, -1, gardenMat(f, (w.x0 + w.x1) / 2)));
    };
    // ground floor garden side (keyplan): cafe, core A and the east rooms on the -4.6 line under the floors above;
    // co-working, core B and gym glazed on the -6.5 line; the garden sits at +1.20
    const baseGarden = () => {
      const gk = 'f0', zr = -4.6, zg = -6.5;
      const run = (x0, x1, z, wins) => {
        box(gk, 'stone', x0, x1, 0, 1.2, z, z + 0.3);
        box(gk, 'stone', x0, x1, 3.95, LV[1], z, z + 0.3);
        let a = x0;
        wins.forEach((w) => { box(gk, 'stone', a, w[0], 1.2, 3.95, z, z + 0.3); pane(gk, w[0], w[1], 1.25, 3.9, z - 0.012, -1, { mull: 1.1, transom: 3.35 }); a = w[1]; });
        box(gk, 'stone', a, x1, 1.2, 3.95, z, z + 0.3);
      };
      run(X0, -20.0, zr, [[-30.2, -27.0], [-26.2, -23.0], [-22.2, -20.6]]);
      run(-20.0, -14.5, zr, [[-16.4, -15.0]]);
      run(-14.5, 14.5, zg, [[-14.2, -9.0], [-8.6, -3.0], [-2.3, -0.4], [0.6, 2.6], [3.2, 8.6], [9.0, 14.2]]);
      run(14.5, X1, zr, [[21.4, 23.6], [24.4, 26.6], [27.4, 29.6]]);
      box(gk, 'stone', -14.8, -14.5, 0, LV[1], zg, zr + 0.3);
      box(gk, 'stone', 14.5, 14.8, 0, LV[1], zg, zr + 0.3);
      // soffit lights under the floor above (portico)
      [[-30.5, -14.8], [14.8, 30.5]].forEach((q) => quadY(gk, 'light', q[0], q[1], ZB + 0.6, ZB + 0.8, LV[1] - 0.01, true));
    };
    const ends = (f) => {
      const gk = 'f' + f, yb = LV[f], yt = LV[f + 1];
      const fzE = f <= 4 ? ZF : frontZ(f, 'E');
      const zEnd = (f >= 2 && f <= 5) ? ZF - LD : fzE;
      box(gk, f <= 1 ? 'stone' : 'plaster', X1, X1 + 0.05, yb, yt, ZB, zEnd);
      if (zEnd < fzE) { railX(gk, zEnd, fzE, yb + 0.2, yb + 1.2, X1 - 0.03, 1); box(gk, 'plaster', X1 - 0.3, X1 + 0.05, yt - 0.34, yt, zEnd, fzE); iso(f * 31 + 7, () => plantBed(gk, zEnd + 0.15, fzE - 0.25, yb + 0.2, X1 - 0.4, 0.42, { axis: 'z', h: 0.4, trail: 1, tall: 0.85, topiary: 0.15, flowers: 0.55, step: 0.32 })); }
      box(gk, f <= 1 ? 'stone' : 'brick', X0 - 0.05, X0, yb, yt, ZBA(f), ZF);
      if (f >= 1) {
        const ws = [[-5.4, -4.0], [-2.4, -1.0], [0.6, 2.0]].concat(f <= 1 || f === 6 ? [[3.4, 4.8]] : []);
        ws.forEach((w) => {
          const y0 = yb + 0.14, y1 = yt - 0.6, xa = X1 + 0.05, xb = X1 + 0.19, wm = f <= 1 ? 'stone' : 'plaster';
          paneX(gk, w[0], w[1], y0, y1, X1 + 0.062, 1);
          box(gk, wm, xa, xb, y0, y1 + 0.14, w[0] - 0.16, w[0] - 0.02);
          box(gk, wm, xa, xb, y0, y1 + 0.14, w[1] + 0.02, w[1] + 0.16);
          box(gk, wm, xa, xb, y1 + 0.02, y1 + 0.16, w[0] - 0.16, w[1] + 0.16);
          box(gk, 'slab', xa, xb + 0.06, y0 - 0.1, y0 - 0.02, w[0] - 0.12, w[1] + 0.12);
          if (f >= 2 && !(f <= 5 && w[0] === 0.6)) railX(gk, w[0], w[1], y0, yb + 1.1, xb + 0.02, 1);
        });
        if (f >= 2 && f <= 5) {
          const z0 = 0.05, z1 = 2.55, xo = X1 + 1.5;
          box(gk, 'plaster', X1 + 0.05, xo, yb - 0.08, yb + 0.2, z0, z1);
          box(gk, 'soffit', X1 + 0.05, xo - 0.05, yb - 0.1, yb - 0.08, z0 + 0.05, z1 - 0.05);
          // framed box: render cheeks on both sides, the next floor's slab (or its own roof on floor 5) closes the top
          box(gk, 'plaster', X1 + 0.05, xo, yb + 0.2, yt - 0.08, z0, z0 + 0.2);
          box(gk, 'plaster', X1 + 0.05, xo, yb + 0.2, yt - 0.08, z1 - 0.2, z1);
          if (f === 5) box(gk, 'plaster', X1 + 0.05, xo, yt - 0.08, yt + 0.2, z0, z1);
          box(gk, 'soffit', X1 + 0.05, xo - 0.04, yt - 0.1, yt - 0.08, z0 + 0.2, z1 - 0.2);
          quadY(gk, 'light', (X1 + xo) / 2 - 0.08, (X1 + xo) / 2 + 0.08, (z0 + z1) / 2 - 0.08, (z0 + z1) / 2 + 0.08, yt - 0.105, true);
          railX(gk, z0 + 0.2, z1 - 0.2, yb + 0.2, yb + 1.15, xo - 0.06, 1);
          iso(f * 53 + 11, () => {
            plantBed(gk, z0 + 0.2, z1 - 1.0, yb + 0.2, xo - 0.32, 0.4, { axis: 'z', h: 0.38, trail: 1, tall: 0.85, topiary: 0.2, flowers: 0.55, step: 0.3 });
            const c = z0 + 0.45 + rnd() * 0.5; cards(gk, xo + 0.05, yb + 0.85, c, 0.06, 0.32, 0.3, 26, CELLS.leaf, 0.12, 0.24);
          });
        }
      }
    };

    // ------------------------------------------------- build the building
    for (let f = 0; f <= 6; f++) {
      if (f <= 1) baseStreet(f); else streetFloor(f);
      if (f === 0) baseGarden(); else gardenFloor(f);
      ends(f);
    }
    // ------------------------------------------------- main entrance (cam-06 render): bronze canopy with timber soffit and
    // downlights over the two glass portals, travertine pier with the brass name plate, stone landing, planters
    {
      const x0 = -5.0, x1 = 5.0, y0 = 3.86, y1 = 4.12, z0 = ZF, z1 = ZF + 2.2;
      box('f0', 'perg', x0, x1, y0, y1, z0, z1);
      box('f0', 'perg', x0, x1, y1, y1 + 0.03, z1 - 0.12, z1);
      box('f0', 'deck', x0 + 0.1, x1 - 0.1, y0 - 0.03, y0, z0 + 0.04, z1 - 0.1);
      for (let x = x0 + 0.7; x < x1 - 0.4; x += 1.2) [z0 + 0.65, z1 - 0.6].forEach((z) => { const d = new THREE.CylinderGeometry(0.07, 0.07, 0.02, 12); d.translate(x, y0 - 0.04, z); put('f0', 'light', d); });
      box('f0', 'slab', -0.46, 0.46, 0.02, 3.76, ZF - 0.02, ZF + 0.03);
      box('f0', 'plaque', -0.27, 0.27, 1.45, 2.2, ZF + 0.03, ZF + 0.06);
      box('site', 'slab', x0 - 0.2, x1 + 0.2, 0.15, 0.2, ZF, ZF + 2.35);
      [-5.9, 5.9].forEach((x) => { box('site', 'perg', x - 0.42, x + 0.42, 0.15, 1.0, ZF + 0.35, ZF + 1.19); topiary('site', x, 1.0, ZF + 0.77, 0.55); });
    }
    // C soffit edge + P5/P6 terraces
    SEG.forEach((s) => {
      if (s[0] === 'A') return;
      const fz4 = frontZ(4, s[0]), y5 = LV[5], y6 = LV[6];
      box('f5', 'paving', s[1], s[2], y5, y5 + 0.05, frontZ(5, s[0]), fz4);
      rail('f5', s[1], s[2], y5 + 0.05, y5 + 1.12, fz4 - 0.06, 1);
      box('f6', 'paving', s[1], s[2], y6, y6 + 0.05, frontZ(6, s[0]), frontZ(5, s[0]));
      rail('f6', s[1], s[2], y6 + 0.05, y6 + 1.12, frontZ(5, s[0]) - 0.06, 1);
      clusters('f5', s[1] + 0.3, s[2] - 0.3, y5 + 0.05, fz4 - 0.45, 0.6, { trail: 1, topiary: 0.1, tall: 1.0, flowers: 0.4 });
      clusters('f6', s[1] + 0.3, s[2] - 0.3, y6 + 0.05, frontZ(5, s[0]) - 0.45, 0.6, { trail: 1, topiary: 0.06, tall: 1.0, flowers: 0.4 });
    });
    // side rails where the floor-5 terraces step between segments
    for (let i = 1; i < SEG.length; i++) {
      const a = frontZ(4, SEG[i - 1][0]), b = frontZ(4, SEG[i][0]), x = SEG[i][1];
      if (Math.abs(a - b) > 0.05) railX('f5', Math.min(a, b) < ZF + 0.01 ? ZF : Math.min(a, b), Math.max(a, b), LV[5] + 0.05, LV[5] + 1.12, x, a > b ? 1 : -1);
    }
    railX('f6', frontZ(6, 'E'), frontZ(5, 'E'), LV[6] + 0.05, LV[6] + 1.12, X1 - 0.04, 1);
    // P6 glass bays
    BAYS6.forEach((b) => {
      const y0 = LV[6], y1 = LV[7], zf = 6.55, zb = frontZ(6, 'B');
      box('f6', 'frame', b[0], b[1], y1 - 0.25, y1, zb, zf);
      pane('f6', b[0] + 0.06, b[1] - 0.06, y0 + 0.08, y1 - 0.31, zf, 1, { mull: 1.05, lit: true });
      quadX('f6', 'glassLit', zb, zf - 0.06, y0 + 0.08, y1 - 0.31, b[0], -1);
      quadX('f6', 'glassLit', zb, zf - 0.06, y0 + 0.08, y1 - 0.31, b[1], 1);
      [b[0], b[1]].forEach((x) => box('f6', 'frame', x - 0.06, x + 0.06, y0, y1, zf - 0.12, zf));
    });
    // roof slab (keyplan roof outline: main terrace to z 4.9, the two bays to 6.4, west wing on its own line),
    // brise-soleil over the floor-6 terraces as in the renders
    box('roof', 'slab', -25.9, X1 + 0.2, LV[7], ROOF, ZB - 0.25, 5.2);
    BAYS6.forEach((b) => box('roof', 'slab', b[0] - 0.1, b[1] + 0.1, LV[7], ROOF, 5.2, 6.75));
    box('roof', 'slab', X0 - 0.2, -25.9, LV[7], ROOF, ZBA(6) - 0.25, ZF + 0.25);
    // white render canopy (renders W958 frontale / close-up terrazzo): solid outer band that carries the roof-edge planting,
    // deep fascia with an upstand, slatted soffit over the two end terraces and a solid soffit between the glass bays
    const CAN_SOLID = [[BAYS6[0][1], BAYS6[1][0]]];
    for (let x = -25.7; x < 30.9; x += 0.42) {
      if (BAYS6.some((b) => x > b[0] - 0.2 && x < b[1] + 0.2) || CAN_SOLID.some((r) => x > r[0] - 0.1 && x < r[1] + 0.1)) continue;
      box('roof', 'plaster', x, x + 0.09, LV[7] - 0.3, LV[7], 5.2, 5.98);
    }
    CAN_SOLID.forEach((r) => box('roof', 'plaster', r[0], r[1], LV[7] - 0.05, ROOF, 5.2, 5.98));
    box('roof', 'plaster', -25.9, X1 + 0.2, LV[7] - 0.05, ROOF, 5.98, 6.86);
    box('roof', 'plaster', -25.9, X1 + 0.2, LV[7] - 0.1, ROOF + 0.16, 6.86, 7.02);
    box('roof', 'plaster', X1 + 0.02, X1 + 0.2, LV[7] - 0.1, ROOF + 0.16, ZB - 0.25, 6.86);
    const RTX0 = -25.9, RTX1 = 29.0, RTS = 4.9;
    quadY('roof', 'porc', RTX0, RTX1, ZB, RTS, ROOF + 0.005);
    BAYS6.forEach((b) => quadY('roof', 'porc', b[0], b[1], RTS, 5.95, ROOF + 0.005));
    quadY('roof', 'roofF', X0, RTX0, ZBA(6), ZF, ROOF + 0.005);
    quadY('roof', 'roofF', RTX1, X1, ZB, 5.2, ROOF + 0.005);
    rail('roof', RTX0, RTX1, ROOF, ROOF + 1.1, ZB - 0.1, -1);
    railX('roof', ZB - 0.1, RTS, ROOF, ROOF + 1.1, RTX1, 1);
    railX('roof', ZB - 0.1, RTS, ROOF, ROOF + 1.1, RTX0, -1);
    { let a = RTX0; BAYS6.forEach((b) => { rail('roof', a, b[0], ROOF, ROOF + 1.1, RTS, 1); rail('roof', b[0], b[1], ROOF, ROOF + 1.1, 5.95, 1); railX('roof', RTS, 5.95, ROOF, ROOF + 1.1, b[0], -1); railX('roof', RTS, 5.95, ROOF, ROOF + 1.1, b[1], 1); a = b[1]; }); rail('roof', a, RTX1, ROOF, ROOF + 1.1, RTS, 1); }
    const chair = (gk, x, y, z, rot) => {
      const c = Math.cos(rot), sn = Math.sin(rot);
      const P = (dx, dz) => [x + dx * c - dz * sn, z + dx * sn + dz * c];
      const q = P(0, 0);
      box(gk, 'frame', q[0] - 0.24, q[0] + 0.24, y + 0.42, y + 0.47, q[1] - 0.24, q[1] + 0.24);
      const b = P(0, -0.24);
      box(gk, 'frame', b[0] - (Math.abs(c) > 0.5 ? 0.24 : 0.03), b[0] + (Math.abs(c) > 0.5 ? 0.24 : 0.03), y + 0.47, y + 0.85, b[1] - (Math.abs(c) > 0.5 ? 0.03 : 0.24), b[1] + (Math.abs(c) > 0.5 ? 0.03 : 0.24));
      [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].forEach((d) => { const l = P(d[0], d[1]); box(gk, 'frame', l[0] - 0.025, l[0] + 0.025, y, y + 0.42, l[1] - 0.025, l[1] + 0.025); });
    };
    const table = (gk, x, y, z, r, n) => {
      const top = new THREE.CylinderGeometry(r, r, 0.05, 28); top.translate(x, y + 0.74, z); put(gk, 'slab', top);
      cyl(gk, 'frame', x, y, y + 0.72, z, 0.05);
      for (let i = 0; i < (n || 0); i++) { const a = i / n * 6.283 + 0.4; chair(gk, x + Math.cos(a) * (r + 0.42), y, z + Math.sin(a) * (r + 0.42), a + Math.PI / 2); }
    };
    // bioclimatic pergola: posts on a grid, deep perimeter beams, tilted louvres (or a solid roof from `solidFrom`)
    const pergola = (gk, x0, x1, z0, z1, yB, yT, o) => {
      o = o || {};
      const PM = o.mat || 'perg', t = 0.1, bd = 0.34;
      const xs = o.posts || [x0, x1];
      const zs = o.wall ? [z0] : [z0, z1];
      xs.forEach((x) => zs.forEach((z) => { box(gk, PM, x - t, x + t, yB, yT, z - t, z + t); box(gk, PM, x - t - 0.06, x + t + 0.06, yB, yB + 0.02, z - t - 0.06, z + t + 0.06); }));
      box(gk, PM, x0 - t, x1 + t, yT - bd, yT, z0 - t, z0 + t);
      box(gk, PM, x0 - t, x1 + t, yT - bd, yT, z1 - t, z1 + t);
      box(gk, PM, x0 - t - 0.02, x1 + t + 0.02, yT - 0.03, yT + 0.02, z0 - t - 0.02, z0 + t + 0.02); box(gk, PM, x0 - t - 0.02, x1 + t + 0.02, yT - 0.03, yT + 0.02, z1 - t - 0.02, z1 + t + 0.02);
      xs.forEach((x) => box(gk, PM, x - t, x + t, yT - bd, yT, z0, z1));
      const sx = o.solidFrom != null ? o.solidFrom : x1, len = z1 - z0 - 2 * t;
      for (let x = x0 + t + 0.12; x < sx - 0.12; x += 0.22) {
        if (xs.some((q) => Math.abs(q - x) < 0.12)) continue;
        const b = new THREE.BoxGeometry(0.2, 0.025, len); b.rotateZ(0.55); b.translate(x, yT - 0.17, (z0 + z1) / 2); put(gk, PM, b);
      }
      if (o.solidFrom != null) box(gk, PM, sx, x1, yT - 0.2, yT - 0.05, z0, z1);
    };
    const armchair = (gk, x, y, z, face) => {
      box(gk, 'cushion', x - 0.42, x + 0.42, y, y + 0.42, z - 0.42, z + 0.42);
      if (face > 0) box(gk, 'cushion', x - 0.42, x + 0.42, y + 0.42, y + 0.78, z - 0.42, z - 0.24);
      else box(gk, 'cushion', x - 0.42, x + 0.42, y + 0.42, y + 0.78, z + 0.24, z + 0.42);
    };
    const tropical = (gk, x, y, z, s) => { box(gk, 'planter', x - 0.4 * s, x + 0.4 * s, y, y + 0.8 * s, z - 0.4 * s, z + 0.4 * s); cards(gk, x, y + 0.8 * s + 0.75 * s, z, 0.75 * s, 0.95 * s, 0.75 * s, 34, CELLS.light, 0.6 * s, 1.1 * s, { upright: true }); };
    // ------------------------------------------------- rooftop (keyplan "piano rooftop"): three stair/lift cores, cafe under a louvred
    // pergola between cores A and B (bar on core A, 3 x 3 tables), swimming pool between cores B and C with sun loungers
    // on the garden side, lounge under the second pergola around core C, armchairs along the street parapet
    const rotBox = (gk, mk, cx, cz, w, d, y0, y1, rot) => { const g = new THREE.BoxGeometry(w, y1 - y0, d); g.rotateY(rot); g.translate(cx, (y0 + y1) / 2, cz); put(gk, mk, g); };
    const RCORE = [[-20.0, -13.7, -18.1, -14.0], [-2.7, 3.6, -0.85, 3.25], [14.3, 20.6, 14.95, 18.8]], RCZ0 = -4.77, RCZ1 = 0.51, RCY = ROOF + 3.25;
    RCORE.forEach((c) => {
      box('roof', 'plaster', c[0], c[1], ROOF, RCY, RCZ0, RCZ1);
      box('roof', 'slab', c[0] - 0.12, c[1] + 0.12, RCY, RCY + 0.16, RCZ0 - 0.12, RCZ1 + 0.12);
      box('roof', 'plaster', c[2], c[3], RCY + 0.16, ROOF + 4.1, -1.65, RCZ1 - 0.1);
      pane('roof', c[0] + 0.5, c[0] + 1.7, ROOF + 0.05, ROOF + 2.35, RCZ1 + 0.012, 1, { lit: true });
    });
    const yR = ROOF + 0.02;
    // walnut-clad core face with bronze fins (renders: tall timber wall beside the pool and behind the bar); axis x = face normal
    const cladX = (gk, x, dir, z0, z1, y0, y1) => {
      const xa = x + dir * 0.005, xb = x + dir * 0.05;
      box(gk, 'walnut', Math.min(xa, xb), Math.max(xa, xb), y0, y1, z0, z1);
      const n = Math.max(2, Math.round((z1 - z0) / 1.35));
      for (let i = 0; i <= n; i++) { const z = z0 + (z1 - z0) * i / n, xf = x + dir * 0.11; box(gk, 'bronze', Math.min(xa, xf), Math.max(xa, xf), y0, y1, z - 0.06, z + 0.06); }
      box(gk, 'bronze', Math.min(xa, x + dir * 0.09), Math.max(xa, x + dir * 0.09), y1 - 0.06, y1, z0, z1);
    };
    const palm = (gk, x, y, z, h) => {
      const tx = x + (rnd() - 0.5) * 0.3, tz = z + (rnd() - 0.5) * 0.3;
      limb(gk, 'trunk', x, y, z, tx, y + h, tz, 0.08, 0.055);
      // arching crown: a flat, slightly domed spread of leaf cards around the trunk top, drooping at the rim
      cards(gk, tx, y + h + 0.05, tz, 0.55, 0.16, 0.55, 26, CELLS.light, 0.3, 0.5, { upright: true });
      cards(gk, tx, y + h - 0.12, tz, 1.15, 0.2, 1.15, 52, CELLS.leaf, 0.32, 0.55);
    };
    const tulipTable = (gk, x, y, z, r) => {
      const top = new THREE.CylinderGeometry(r, r, 0.05, 32); top.translate(x, y + 0.745, z); put(gk, 'stoneT', top);
      const ped = new THREE.CylinderGeometry(0.1, 0.36, 0.72, 24); ped.translate(x, y + 0.36, z); put(gk, 'stoneT', ped);
    };
    const ropeChair = (gk, x, y, z, rot) => {
      const c = Math.cos(rot), sn = Math.sin(rot), P = (dx, dz) => [x + dx * c + dz * sn, z - dx * sn + dz * c];
      const R2 = (mk, dx, dz, w, d, y0, y1) => { const q = P(dx, dz); rotBox(gk, mk, q[0], q[1], w, d, y0, y1, rot); };
      [[-0.27, -0.24], [0.27, -0.24], [-0.27, 0.22], [0.27, 0.22]].forEach((l) => R2('oak', l[0], l[1], 0.06, 0.06, y, y + 0.42));
      R2('oak', 0, 0, 0.62, 0.56, y + 0.38, y + 0.44);
      R2('rope', 0, -0.25, 0.6, 0.07, y + 0.44, y + 0.8);
      R2('oak', -0.3, 0, 0.06, 0.56, y + 0.44, y + 0.66); R2('oak', 0.3, 0, 0.06, 0.56, y + 0.44, y + 0.66);
      R2('cushion', 0, 0.02, 0.5, 0.46, y + 0.44, y + 0.53);
      R2('cushion', 0, -0.17, 0.46, 0.12, y + 0.53, y + 0.74);
    };
    // cafe pergola (A-B)
    {
      const x0 = -13.7, x1 = -2.7, z0 = -6.45, z1 = 1.9;
      pergola('roof', x0, x1, z0, z1, ROOF, ROOF + 3.2, { posts: [-13.45, -8.2, -2.95] });
      cladX('roof', x0, 1, RCZ0, RCZ1, ROOF, RCY);
      [-3.9, -2.3, -0.7].forEach((zc) => { box('roof', 'bronze', x0 + 0.05, x0 + 0.1, yR + 1.55, yR + 2.55, zc - 0.74, zc + 0.74); box('roof', 'walnut', x0 + 0.1, x0 + 0.13, yR + 1.6, yR + 2.5, zc - 0.69, zc + 0.69); });
      box('roof', 'poolWall', x0 + 0.05, x0 + 0.7, yR, yR + 0.92, -4.6, 0.35);
      box('roof', 'trav', x0 + 0.7, x0 + 1.25, yR, yR + 1.05, -4.6, 0.35);
      box('roof', 'poolWall', x0 + 0.6, x0 + 1.3, yR + 1.05, yR + 1.1, -4.65, 0.4);
      box('roof', 'slab', -12.25, -11.75, yR, yR + 1.08, -4.1, -0.3);
      box('roof', 'slab', -12.35, -11.65, yR + 1.08, yR + 1.14, -4.15, -0.25);
      box('roof', 'light', -12.3, -11.7, yR + 0.02, yR + 0.06, -4.08, -0.32);
      for (let z = -3.7; z < -0.5; z += 0.8) { cyl('roof', 'frame', -11.3, yR, yR + 0.74, z, 0.03); const st = new THREE.CylinderGeometry(0.2, 0.2, 0.07, 18); st.translate(-11.3, yR + 0.78, z); put('roof', 'cushion', st); }
      [-9.6, -7.0, -4.4].forEach((x) => [-5.5, -2.9, -0.4].forEach((z) => { tulipTable('roof', x, yR, z, 0.55); [0, 1, 2, 3].forEach((k) => { const a = k * Math.PI / 2 + 0.785; ropeChair('roof', x + Math.cos(a) * 0.9, yR, z + Math.sin(a) * 0.9, Math.PI / 2 - a); }); }));
      plantBed('roof', -4.8, 0.5, yR, -3.95, 0.6, { axis: 'z', h: 0.45, tall: 0.9, flowers: 0.4, step: 0.55 });
      plantBed('roof', -19.9, -14.0, yR, -5.7, 0.9, { h: 0.45, tall: 0.9, flowers: 0.5, step: 0.55 });
    }
    // swimming pool (B-C): raised dark tank, stone coping, lit edge; loungers on the garden side
    {
      const px0 = 3.9, px1 = 14.3, pz0 = -3.7, pz1 = -0.5, yW = ROOF + 0.95;
      box('roof', 'porc', 3.6, 14.3, ROOF, ROOF + 0.03, -6.6, 0.55);
      box('roof', 'poolWall', px0 - 0.12, px1 + 0.12, ROOF, yW, pz0 - 0.12, pz0);
      box('roof', 'poolWall', px0 - 0.12, px1 + 0.12, ROOF, yW, pz1, pz1 + 0.12);
      box('roof', 'poolWall', px0 - 0.12, px0, ROOF, yW, pz0, pz1);
      box('roof', 'poolWall', px1, px1 + 0.12, ROOF, yW, pz0, pz1);
      box('roof', 'poolWall', px0, px1, ROOF, yW - 1.4 + 0.95, pz0, pz1);
      quadY('roof', 'water', px0, px1, pz0, pz1, yW - 0.015);
      // two floating porcelain steps along the street-side wall, LED line in the shadow gap under each
      [[ROOF + 0.1, ROOF + 0.36, 1.3, px0 + 2.2, px1 + 0.12], [ROOF + 0.44, ROOF + 0.68, 0.66, px0 + 3.1, px1 + 0.12]].forEach((st) => {
        const zf = pz1 + 0.12 + st[2];
        box('roof', 'stoneW', st[3], st[4], st[0], st[1], pz1 + 0.12, zf);
        box('roof', 'light', st[3] + 0.08, st[4] - 0.02, st[0] - 0.05, st[0] - 0.02, zf - 0.16, zf - 0.1);
        quadY('roof', 'light', st[3] + 0.05, st[4], zf - 0.04, zf + 0.07, st[0] === ROOF + 0.1 ? ROOF + 0.034 : ROOF + 0.362);
        box('roof', 'poolWall', st[3] + 0.25, st[4] - 0.1, st[0] - 0.08, st[0], pz1 + 0.12, zf - 0.3);
      });
      // daybeds against the taupe parapet on the garden side, small round side tables between them
      [4.7, 6.75, 8.8, 10.85, 12.9].forEach((x, i) => {
        const z = -5.52;
        box('roof', 'taupe', x - 0.45, x + 0.45, ROOF + 0.03, ROOF + 0.3, z - 0.9, z + 0.9);
        box('roof', 'taupe', x - 0.42, x + 0.42, ROOF + 0.3, ROOF + 0.42, z - 0.84, z + 0.87);
        box('roof', 'taupe', x - 0.42, x + 0.42, ROOF + 0.42, ROOF + 0.72, z - 0.88, z - 0.66);
        box('roof', 'cushion', x - 0.3, x + 0.3, ROOF + 0.42, ROOF + 0.54, z - 0.64, z - 0.42);
        if (i < 4) { const t = new THREE.CylinderGeometry(0.2, 0.2, 0.04, 20); t.translate(x + 1.02, ROOF + 0.5, z - 0.6); put('roof', 'bronze', t); cyl('roof', 'bronze', x + 1.02, ROOF + 0.03, ROOF + 0.48, z - 0.6, 0.025); }
      });
      box('roof', 'parapetT', 3.6, 14.3, ROOF, ROOF + 0.95, -6.74, -6.5);
      iso(77, () => { plantBed('roof', 3.7, 14.2, ROOF + 0.95, -6.62, 0.24, { h: 0.05, tall: 0.75, flowers: 0.15, step: 0.38, topiary: 0.1 }); for (let x = 4.6; x < 14; x += 2.2 + rnd() * 1.0) palm('roof', x, ROOF + 0.95, -6.62, 1.5 + rnd() * 0.9); });
      cladX('roof', 3.6, 1, RCZ0, RCZ1, ROOF, RCY);
      cladX('roof', 14.3, -1, RCZ0, RCZ1, ROOF, RCY);
    }
    // lounge pergola around core C
    {
      const x0 = 14.3, x1 = 27.8, z0 = -6.45, z1 = 1.9;
      pergola('roof', x0, x1, z0, z1, ROOF, ROOF + 3.2, { posts: [20.9, 24.4, 27.55] });
      box('roof', 'deck', 20.8, 27.7, ROOF, ROOF + 0.06, z0 + 0.1, z1 - 0.1);
      const sofa = (cx, cz, len, faceZ) => {
        box('roof', 'trunk', cx - len / 2, cx + len / 2, yR, yR + 0.24, cz - 0.42, cz + 0.42);
        box('roof', 'cushion', cx - len / 2 + 0.04, cx + len / 2 - 0.04, yR + 0.24, yR + 0.42, cz - 0.4, cz + 0.4);
        const bz = cz - faceZ * 0.32;
        box('roof', 'cushion', cx - len / 2 + 0.04, cx + len / 2 - 0.04, yR + 0.42, yR + 0.8, bz - 0.1, bz + 0.1);
      };
      [[25.2, -3.9], [25.2, -0.3]].forEach((q) => {
        sofa(q[0], q[1] - 1.0, 2.1, 1); sofa(q[0], q[1] + 1.0, 2.1, -1);
        box('roof', 'slab', q[0] - 0.55, q[0] + 0.55, yR, yR + 0.36, q[1] - 0.4, q[1] + 0.4);
        armchair('roof', q[0] + 1.85, yR, q[1], 1);
      });
      sofa(22.2, -2.5, 1.9, -1); sofa(22.2, 0.1, 1.9, 1);
      box('roof', 'slab', 21.7, 22.7, yR, yR + 0.36, -1.6, -0.8);
      tropical('roof', 27.3, ROOF, 1.5, 1); tropical('roof', 21.4, ROOF, -5.9, 1);
    }
    // street-side strip: armchairs with side tables, sofas in the two bays
    [-2.4, 2.3, 7.2, 12.0].forEach((x) => {
      armchair('roof', x - 0.95, yR, 3.75, -1); armchair('roof', x + 0.95, yR, 3.75, -1);
      const t = new THREE.CylinderGeometry(0.28, 0.28, 0.5, 20); t.translate(x, yR + 0.25, 3.6); put('roof', 'slab', t);
    });
    [[-9.6, -6.8, -9.0], [15.6, 18.9, 16.0]].forEach((b) => {
      box('roof', 'trunk', b[0], b[1], yR, yR + 0.26, 3.6, 4.5);
      box('roof', 'cushion', b[0] + 0.05, b[1] - 0.05, yR + 0.26, yR + 0.44, 3.65, 4.45);
      box('roof', 'cushion', b[0] + 0.05, b[1] - 0.05, yR + 0.44, yR + 0.82, 4.25, 4.45);
      armchair('roof', b[2], yR, 2.7, 1); armchair('roof', b[2] + 1.5, yR, 2.7, 1);
    });
    // planters along the parapets, olive trees on the open west terrace
    const edgeGarden = { h: 0.3, tall: 0.95, flowers: 0.62, step: 0.3, topiary: 0.14, trail: 1 };
    for (let x = -25.6; x < 30.7; x += 4.6) {
      plantBed('roof', x, Math.min(30.7, x + 4.45), ROOF, 6.42, 0.8, edgeGarden);
      for (let fx = x + 0.4; fx < Math.min(30.5, x + 4.3); fx += 0.7 + rnd() * 0.6) flowers('roof', fx, ROOF + 0.55 + rnd() * 0.25, 6.5, 0.6, 5 + ((rnd() * 5) | 0), 0);
    }
    const lowBed = { h: 0.42, tall: 0.75, flowers: 0.5, step: 0.36, topiary: 0.22 };
    [[-19.9, -11.6, 4.3], [21.2, 28.6, 4.35], [-11.4, -3.0, 4.3], [3.8, 14.1, 4.3]].forEach((r) => plantBed('roof', r[0], r[1], ROOF, r[2], 0.6, lowBed));
    plantBed('roof', ZB + 0.3, 4.4, ROOF, 28.55, 0.6, Object.assign({ axis: 'z' }, lowBed));
    plantBed('roof', RTX0 + 0.3, -20.3, ROOF, ZB + 0.45, 0.6, lowBed);
    [[-23.6, -3.6], [-23.6, 2.4]].forEach((q) => tropical('roof', q[0], ROOF, q[1], 1.15));
    // festoon lights strung over the pool between cores B and C, parasols by the loungers, pool wall lights
    const wire = (gk, p, q) => {
      const d = new THREE.Vector3(q[0] - p[0], q[1] - p[1], q[2] - p[2]), L = d.length();
      const g = new THREE.CylinderGeometry(0.009, 0.009, L, 4);
      g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()));
      g.translate((p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2); put(gk, 'frame', g);
    };
    const festoon = (gk, a, b, sag, n) => {
      let prev = a;
      for (let i = 1; i <= n; i++) {
        const t = i / n, pt = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t - sag * 4 * t * (1 - t), a[2] + (b[2] - a[2]) * t];
        wire(gk, prev, pt);
        if (i < n) { const s = new THREE.SphereGeometry(0.065, 8, 6); s.translate(pt[0], pt[1] - 0.09, pt[2]); put(gk, 'light', s); }
        prev = pt;
      }
    };

    // ------------------------------------------------- site model on a plinth
    // ------------------------------------------------- site model: the whole block (Via A. Pasinetti, Via Gallura, Via G. Ripamonti,
    // Piazza E. Chiaradia) on a deep plinth that also houses the two garage levels
    const PX0 = -80, PX1 = 128, PZ0 = -57, PZ1 = 47, PY0 = -7.4;
    // plinth and board with an opening for the car ramp (street gate -> garage, east of the building)
    const HX0 = 31.15, HX1 = 36.45, HZ0 = -5.5, HZ1 = ZF;
    [[PX0, HX0, PZ0, PZ1], [HX1, PX1, PZ0, PZ1], [HX0, HX1, PZ0, HZ0], [HX0, HX1, HZ1, PZ1]].forEach((r) => { box('site', 'plinth', r[0], r[1], PY0, -0.03, r[2], r[3]); quadY('site', 'board', r[0], r[1], r[2], r[3], -0.02); });
    box('site', 'plinth', HX0, HX1, PY0, -3.6, HZ0, HZ1);
    box('site', 'brass', PX0 - 0.09, PX1 + 0.09, -0.16, -0.01, PZ1, PZ1 + 0.09);
    box('site', 'brass', PX0 - 0.09, PX1 + 0.09, -0.16, -0.01, PZ0 - 0.09, PZ0);
    box('site', 'brass', PX0 - 0.09, PX0, -0.16, -0.01, PZ0, PZ1);
    box('site', 'brass', PX1, PX1 + 0.09, -0.16, -0.01, PZ0, PZ1);
    // block edge on Piazza Chiaradia: a straight line slightly off the north-south axis (satellite view)
    const xW = (z) => -52.0 + (z - 9.3) * 0.1496;
    const along = (gk, mk, za, zb, w0, w1, y0, y1) => {
      // strip between offsets w0..w1 east of the line xW, from za to zb
      const xa = xW(za), xb = xW(zb), dx = xb - xa, dz = zb - za, L = Math.hypot(dx, dz), ang = Math.atan2(dx, dz);
      const g = new THREE.BoxGeometry(Math.abs(w1 - w0), y1 - y0, L);
      g.translate(-(w0 + w1) / 2, (y0 + y1) / 2, L / 2);
      g.rotateY(ang); g.translate(xa, 0, za);
      if (TILE[mk]) worldUV(g, TILE[mk]);
      put(gk, mk, g);
    };
    const RIP0 = 84, RIP1 = 106, GAL0 = -49.5, GAL1 = -41.5;
    // Via Antonio Pasinetti
    box('site', 'walk', xW(ZF) + 2.5, RIP0 - 2.5, -0.02, 0.15, ZF, 9.3);
    box('site', 'kerb', xW(9.3) - 0.1, RIP0 - 0.15, -0.02, 0.16, 9.18, 9.45);
    quadY('site', 'asphalt', PX0, RIP1, 9.45, 17.6, 0.004);
    for (let x = PX0 + 1.2; x < RIP0 - 2.4; x += 5) if (x + 2.4 < xW(13) - 13 || x > xW(13) + 1) box('site', 'zebra', x, x + 2.4, 0.004, 0.012, 13.48, 13.6);
    box('site', 'kerb', PX0, RIP0, -0.02, 0.16, 17.6, 17.87);
    box('site', 'walk', PX0, RIP0, -0.02, 0.15, 17.75, 21.2);
    // Via Gallura (behind the block)
    quadY('site', 'asphalt', PX0, RIP1, GAL0, GAL1, 0.004);
    box('site', 'walk', xW(GAL1) + 2.5, RIP0 - 2.5, -0.02, 0.15, GAL1, GAL1 + 2.0);
    box('site', 'kerb', xW(GAL1), RIP0 - 0.15, -0.02, 0.16, GAL1 - 0.15, GAL1 + 0.12);
    box('site', 'walk', PX0, RIP0, -0.02, 0.15, GAL0 - 3.0, GAL0);
    box('site', 'kerb', PX0, RIP0, -0.02, 0.16, GAL0 - 0.12, GAL0 + 0.15);
    // Via Giuseppe Ripamonti: wide avenue with tram tracks and plane trees
    [[17.6, PZ1], [GAL1, 9.45], [PZ0, GAL0]].forEach((r) => {
      quadY('site', 'asphalt', RIP0, RIP1, r[0], r[1], 0.004);
      box('site', 'kerb', RIP0 - 0.27, RIP0, -0.02, 0.16, r[0], r[1]);
      box('site', 'kerb', RIP1, RIP1 + 0.27, -0.02, 0.16, r[0], r[1]);
    });
    [92.3, 93.75, 96.25, 97.7].forEach((x) => box('site', 'tram', x - 0.05, x + 0.05, 0.004, 0.03, PZ0, PZ1));
    box('site', 'walk', RIP0 - 2.5, RIP0 - 0.15, -0.02, 0.15, GAL1, 9.3);
    box('site', 'walk', RIP1 + 0.15, RIP1 + 3.5, -0.02, 0.15, PZ0, PZ1);
    // south side of Via Pasinetti and the diagonal street on the west
    along('site', 'walk', 17.75, PZ1, 0, 2.5, -0.02, 0.15);
    along('site', 'kerb', 17.75, PZ1, -0.15, 0.12, -0.02, 0.16);
    box('site', 'walk', RIP0 - 2.5, RIP0 - 0.15, -0.02, 0.15, 17.75, 21.2);
    // zebra crossings at the corners
    const zebraX = (x0, x1, z0, z1) => { for (let z = z0; z < z1 - 0.3; z += 1.0) box('site', 'zebra', x0, x1, 0.004, 0.012, z, z + 0.5); };
    const zebraZ = (x0, x1, z0, z1) => { for (let x = x0; x < x1 - 0.3; x += 1.0) box('site', 'zebra', x, x + 0.5, 0.004, 0.012, z0, z1); };
    zebraX(RIP0 - 6.5, RIP0 - 3.5, 9.7, 17.4); zebraX(xW(13) + 3.2, xW(13) + 6.2, 9.7, 17.4);
    zebraZ(RIP0 + 0.6, RIP1 - 0.6, 18.4, 21.0); zebraZ(RIP0 + 0.6, RIP1 - 0.6, 6.0, 8.6);
    zebraX(RIP0 - 6.5, RIP0 - 3.5, GAL0 + 0.3, GAL1 - 0.3);
    // road wear: cast-iron manhole covers in a dark ring, gutter drains along the kerbs
    {
      const disc = (x, z, r) => {
        const g = new THREE.CircleGeometry(r, 20); g.rotateX(-Math.PI / 2); g.translate(x, 0.0075, z); put('site', 'manhole', g);
        const rg = new THREE.RingGeometry(r, r + 0.06, 20); rg.rotateX(-Math.PI / 2); rg.translate(x, 0.007, z); put('site', 'trim', rg);
      };
      [[-62, 12.4], [-31, 14.6], [3, 12.2], [27, 14.9], [58, 12.6], [73, 15.0], [95, 2], [91, -20], [99, 30], [-30, -45.5], [20, -46], [60, -45.3]].forEach((q) => disc(q[0], q[1], 0.32));
      for (let x = -70; x < 80; x += 19) { box('site', 'trim', x, x + 0.62, 0.004, 0.009, 9.47, 9.79); box('site', 'trim', x + 9, x + 9.62, 0.004, 0.009, 17.27, 17.58); }
    }
    box('site', 'walk', RIP0 - 2.5, RIP0 - 0.15, -0.02, 0.15, 21.2, PZ1);
    box('site', 'walk', RIP0 - 2.5, RIP0 - 0.15, -0.02, 0.15, PZ0, GAL0 - 3.0);
    // Piazza Chiaradia side: street, sidewalks and the small park
    [[PZ1, 17.6], [9.45, GAL1], [GAL0, PZ0]].forEach((r) => along('site', 'asphalt', r[0], r[1], -12, 0, -0.01, 0.006));
    along('site', 'walk', 9.3, GAL1, 0, 2.5, -0.02, 0.15);
    along('site', 'kerb', 9.3, GAL1, -0.15, 0.12, -0.02, 0.16);
    along('site', 'walk', 9.3, GAL1, -15, -12, -0.02, 0.15);
    along('site', 'grass', 9.3, GAL1, -27, -15, -0.02, 0.08);
    // ---- the rest of the block: refined white massing with muted terracotta roofs (Milan perimeter block)
    const edgePts = [], edgeN = [];
    const outline = (E, pts, y0, y1) => {
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i], q = pts[(i + 1) % pts.length];
        E.push(p[0], y1, p[1], q[0], y1, q[1]);
        E.push(p[0], y0, p[1], p[0], y1, p[1]);
      }
    };
    const prism = (gk, mk, pts, y0, y1, uvf) => {
      const sh = new THREE.Shape(pts.map((p) => new THREE.Vector2(p[0], -p[1])));
      const g = new THREE.ExtrudeGeometry(sh, { depth: y1 - y0, bevelEnabled: false });
      g.rotateX(-Math.PI / 2); g.translate(0, y0, 0);
      if (uvf) uvf(g); else if (TILE[mk]) worldUV(g, TILE[mk]);
      put(gk, mk, g);
    };
    // facade mapping: one texture tile per bay (bw) and storey (fh) from y0; horizontal faces get a plain wall texel
    const facadeUV = (bw, fh, y0, plain) => (g) => {
      const q = g.attributes.position, n = g.attributes.normal, uv = g.attributes.uv;
      for (let i = 0; i < q.count; i++) {
        if (plain || Math.abs(n.getY(i)) > 0.5) { uv.setXY(i, 0.03, 0.97); continue; }
        const hz = Math.abs(n.getX(i)) > Math.abs(n.getZ(i)) ? q.getZ(i) : q.getX(i);
        uv.setXY(i, hz / bw, (q.getY(i) - y0) / fh);
      }
    };
    const segBox = (gk, mk, a, b, y0, y1, t) => {
      const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz);
      const g = new THREE.BoxGeometry(L + t, y1 - y0, t); g.rotateY(-Math.atan2(dz, dx)); g.translate((a[0] + b[0]) / 2, (y0 + y1) / 2, (a[1] + b[1]) / 2);
      if (TILE[mk]) worldUV(g, TILE[mk]); put(gk, mk, g);
    };
    const outset = (pts, d) => {
      const c = pts.reduce((a, p) => [a[0] + p[0] / pts.length, a[1] + p[1] / pts.length], [0, 0]);
      return pts.map((p) => [p[0] + Math.sign(p[0] - c[0]) * d, p[1] + Math.sign(p[1] - c[1]) * d]);
    };
    const gable = (gk, x0, x1, z0, z1, y, rise, alongZ, wallMk) => {
      const o = 0.35;
      const tri = (a, b, c, mk) => {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c], 3)); g.computeVertexNormals();
        const uvOf = (v) => mk === 'roofT' ? (alongZ ? [v[2] / 2.0, v[0] / 2.4] : [v[0] / 2.0, v[2] / 2.4]) : [0.03, 0.97];
        g.setAttribute('uv', new THREE.Float32BufferAttribute([...uvOf(a), ...uvOf(b), ...uvOf(c)], 2)); put(gk, mk, g);
      };
      const quad = (a, b, c, d, mk) => { tri(a, b, c, mk); tri(a, c, d, mk); };
      if (!alongZ) {
        const zm = (z0 + z1) / 2, X0 = x0 - o, X1 = x1 + o, Z0 = z0 - o, Z1 = z1 + o, yr = y + rise;
        quad([X0, y, Z1], [X1, y, Z1], [X1, yr, zm], [X0, yr, zm], 'roofT');
        quad([X1, y, Z0], [X0, y, Z0], [X0, yr, zm], [X1, yr, zm], 'roofT');
        tri([x0, y, z0], [x0, y, z1], [x0, yr, zm], wallMk);
        tri([x1, y, z1], [x1, y, z0], [x1, yr, zm], wallMk);
      } else {
        const xm = (x0 + x1) / 2, X0 = x0 - o, X1 = x1 + o, Z0 = z0 - o, Z1 = z1 + o, yr = y + rise;
        quad([X1, y, Z1], [X1, y, Z0], [xm, yr, Z0], [xm, yr, Z1], 'roofT');
        quad([X0, y, Z0], [X0, y, Z1], [xm, yr, Z1], [xm, yr, Z0], 'roofT');
        tri([x1, y, z0], [x0, y, z0], [xm, yr, z0], wallMk);
        tri([x0, y, z1], [x1, y, z1], [xm, yr, z1], wallMk);
      }
    };
    // a Milanese neighbour: shops at street level (optional), rendered storeys with windows, plain attic,
    // stone cornice, flat roof or clay-tiled pitched roof. The ground band can live in another group (always visible).
    let bldN = 0;
    const GROUND_H = 3.8, FLOOR_H = 3.1, BAY_W = 3.4;
    const bld = (gk, pts, h, roof, o) => {
      o = o || {};
      const mk = o.mk || ['ctx0', 'ctx1', 'ctx2', 'ctx3', 'ctx4', 'ctx0', 'ctx1'][bldN++ % 7];
      const gGk = o.groundGk || gk, shops = o.shops !== false && h > 7;
      const y0 = shops ? GROUND_H : 0;
      if (shops) {
        // the shop storey is also what stays when the storeys above fade: give it a real roof (membrane, parapet, plant)
        prism(gGk, 'shop', pts, -0.02, GROUND_H, facadeUV(BAY_W, GROUND_H, 0));
        prism(gGk, 'roofM', pts, GROUND_H + 0.22, GROUND_H + 0.26);
        pts.forEach((a, i) => { const b = pts[(i + 1) % pts.length]; segBox(gGk, 'slab', a, b, GROUND_H + 0.22, GROUND_H + 0.62, 0.22); });
        const c = pts.reduce((q, p) => [q[0] + p[0] / pts.length, q[1] + p[1] / pts.length], [0, 0]);
        const nU = 1 + ((rnd() * 3) | 0);
        for (let k = 0; k < nU; k++) { const ux = c[0] + (rnd() - 0.5) * 6, uz = c[1] + (rnd() - 0.5) * 4; box(gGk, 'curb', ux - 0.6, ux + 0.6, GROUND_H + 0.26, GROUND_H + 1.0, uz - 0.45, uz + 0.45); box(gGk, 'frame', ux - 0.5, ux + 0.5, GROUND_H + 1.0, GROUND_H + 1.03, uz - 0.35, uz + 0.35); }
        if (rnd() < 0.6) { const sx = c[0] + (rnd() - 0.5) * 4, sz = c[1] + (rnd() - 0.5) * 3; box(gGk, 'slab', sx - 1.0, sx + 1.0, GROUND_H + 0.26, GROUND_H + 0.6, sz - 0.7, sz + 0.7); box(gGk, 'carGlass', sx - 0.9, sx + 0.9, GROUND_H + 0.6, GROUND_H + 0.64, sz - 0.6, sz + 0.6); }
      }
      if (h <= 7) { prism(gk, mk, pts, -0.02, h, facadeUV(BAY_W, FLOOR_H, 0.2)); }
      else {
        const n = Math.max(1, Math.floor((h - y0 - 0.5) / FLOOR_H)), yw = y0 + n * FLOOR_H;
        prism(gk, mk, pts, y0, yw, facadeUV(BAY_W, FLOOR_H, y0));
        prism(gk, mk, pts, yw, h - 0.32, facadeUV(BAY_W, FLOOR_H, 0, true));
        prism(gk, 'slab', outset(pts, 0.28), h - 0.32, h);
        if (shops) prism(gGk, 'slab', outset(pts, 0.12), GROUND_H - 0.02, GROUND_H + 0.22);
      }
      if (roof === 'f') {
        const c = pts.reduce((a, p) => [a[0] + p[0] / pts.length, a[1] + p[1] / pts.length], [0, 0]);
        const inset = pts.map((p) => [p[0] + (c[0] - p[0]) * 0.05, p[1] + (c[1] - p[1]) * 0.05]);
        prism(gk, 'roofF', inset, h, h + 0.1);
      } else if (roof) {
        const xs = pts.map((p) => p[0]), zs = pts.map((p) => p[1]);
        const x0 = Math.min(...xs), x1 = Math.max(...xs), z0 = Math.min(...zs), z1 = Math.max(...zs);
        const alongZ = (z1 - z0) > (x1 - x0);
        gable(gk, x0, x1, z0, z1, h, Math.min(3.4, ((alongZ ? x1 - x0 : z1 - z0)) * 0.22), alongZ, mk);
      }
    };
    const R = (x0, x1, z0, z1) => [[x0, z1], [x1, z1], [x1, z0], [x0, z0]];
    const W = (z0, z1, x1) => [[xW(z1) + 2.5, z1], [x1, z1], [x1, z0], [xW(z0) + 2.5, z0]];
    // west side, Pasinetti corner (27.3 m, from the street elevation drawing) and the Piazza Chiaradia wing
    bld('site', W(-6, ZF, -31.08), 27.3, 'f', { mk: 'ctx3' });
    bld('site', W(-26.5, -6, -38), 16, 'f');
    bld('site', R(-38, -31.08, -21.6, -6), 6.2, 'f', { shops: false });
    // east side along Via Pasinetti to the Ripamonti corner, and the Ripamonti wing
    bld('site', R(36.9, 48, -2.5, ZF), 13.4, 'g', { mk: 'ctx1' });
    bld('site', R(36.9, 48, -21.6, -2.5), 10.2, 'f', { shops: false });
    bld('site', R(48, 62, -8, ZF), 18, 'g', { mk: 'ctx2' });
    bld('site', R(62, RIP0 - 2.5, -10, ZF), 21, 'g', { mk: 'ctx0' });
    bld('site', R(68, RIP0 - 2.5, -26, -10), 22, 'g', { mk: 'ctx4' });
    bld('site', R(50, 64, -24, -12), 6.5, 'f', { shops: false });
    // north side on Via Gallura (fades out when the camera looks from the garden side)
    const GF = GAL1 + 2.0;
    bld('ctxN', W(-26.5, GF, -38), 21, 'f', { mk: 'ctx3', groundGk: 'site' });
    bld('ctxN', R(-38, -14, GF, -27), 19, 'g', { mk: 'ctx1', groundGk: 'site' });
    bld('ctxN', R(-14, 6, GF, -27.5), 22, 'g', { mk: 'ctx0', groundGk: 'site' });
    bld('ctxN', R(6, 22, GF, -28), 17, 'g', { mk: 'ctx2', groundGk: 'site' });
    bld('ctxN', R(22, 40, GF, -27), 20, 'f', { mk: 'ctx4', groundGk: 'site' });
    bld('ctxN', R(40, 60, GF, -27.5), 18, 'g', { mk: 'ctx1', groundGk: 'site' });
    bld('ctxN', R(60, RIP0 - 2.5, GF, -26), 24, 'g', { mk: 'ctx0', groundGk: 'site' });
    bld('ctxN', R(-28, -12, -26.5, -22.4), 4.5, 'f', { shops: false, mk: 'ctx3' });
    bld('ctxN', R(-6, 10, -27.5, -22.6), 3.5, 'f', { shops: false, mk: 'ctx4' });
    bld('ctxN', R(14, 22, -28, -23.2), 6, 'f', { shops: false, mk: 'ctx0' });
    // south side of Via Pasinetti: shops stay (cut section), the storeys above fade when the camera is on the street side
    const SB = 21.4, SF = 33.4;
    // footprints stay on the plinth as a cut site model; the volumes fade when the camera is on the street side
    const foot = (pts) => { prism('site', 'courtP', pts, -0.02, 0.28); pts.forEach((a, i) => segBox('site', 'kerb', a, pts[(i + 1) % pts.length], 0.26, 0.4, 0.22)); };
    // south side: a kept shop storey would hide the street and the project's base from the hero camera, so these neighbours
    // stay cut at the ground: each footprint is a paved pad a little lighter than the courtyards, edged in granite; the north side keeps its shop storey
    const south = (x0, x1, z0, z1, h, roof, mk) => { const pts = x0 === null ? W(z0, z1, x1) : R(x0, x1, z0, z1); foot(pts); bld('ctxS', pts, h, roof, { mk: mk }); };
    south(null, -24, SB, SF, 14.5, 'g', 'ctx1');
    south(-24, -6, SB, SF, 12.5, 'g', 'ctx0');
    south(-6, 10, SB, SF, 16.2, 'f', 'ctx3');
    south(10, 30, SB, SF, 13.5, 'g', 'ctx2');
    south(30, 48, SB, SF, 15.2, 'g', 'ctx0');
    south(48, 66, SB, SF, 12.5, 'g', 'ctx1');
    south(66, RIP0 - 2.5, SB, 46.6, 16.5, 'g', 'ctx4');
    [[W(SF + 4, 46.6, -16), 13.5, 'g', 'ctx2'], [R(4, 22, SF + 5, 46.6), 6.5, 'f', 'ctx3'], [R(38, 58, SF + 4, 46.6), 10.5, 'g', 'ctx0']].forEach((b) => { foot(b[0]); bld('ctxS', b[0], b[1], b[2], { mk: b[3], shops: false }); });
    // east side of Via Ripamonti
    const EX0 = RIP1 + 3.5;
    bld('site', R(EX0, PX1 - 0.6, 14, PZ1 - 0.6), 18.5, 'g', { mk: 'ctx0' });
    bld('site', R(EX0, PX1 - 0.6, -12, 10), 24.6, 'f', { mk: 'ctx3' });
    bld('site', R(EX0, PX1 - 0.6, -38, -16), 15.6, 'g', { mk: 'ctx1' });
    bld('site', R(EX0, PX1 - 0.6, PZ0 + 0.6, -42), 21.5, 'g', { mk: 'ctx2' });
    box('site', 'walk', EX0, PX1, -0.02, 0.15, 10, 14);
    box('site', 'walk', EX0, PX1, -0.02, 0.15, -16, -12);
    box('site', 'walk', EX0, PX1, -0.02, 0.15, -42, -38);
    // inner courtyards: paving and lawns
    quadY('site', 'court', xW(GAL1 + 2) + 2.5, RIP0 - 2.5, GAL1 + 2.0, -16.65, 0.004);
    [[-36, -21, -38, -28], [-12, 8, -24, -17.6], [14, 34, -38.5, -30], [40, 60, -38.6, -29], [62, 80, -38, -28]].forEach((q) => quadY('site', 'grass', q[0], q[1], q[2], q[3], 0.012));
    quadY('site', 'paving', 50, 66, -26.5, -24.2, 0.01);
    quadY('site', 'grass', -10, 36, SF + 0.4, SF + 4.6, 0.01);
    // south blocks seen from the street side: the volumes fade, so what stays is their ground. Paved courtyards under every
    // footprint, lawns with clipped hedges, a residents' parking court, a few small ornamental trees at the back
    prism('site', 'court', [[xW(21.2) + 2.5, 21.2], [RIP0 - 2.5, 21.2], [RIP0 - 2.5, PZ1 - 0.4], [xW(PZ1 - 0.4) + 2.5, PZ1 - 0.4]], -0.018, 0.002);
    [[40, 64, SF + 0.8, SF + 3.6], [-14, 2.5, SF + 5.6, 45.6], [59, 65.4, SF + 5, 45.6], [-38, -17, SF + 0.8, SF + 3.4]].forEach((q) => quadY('site', 'grass', q[0], q[1], q[2], q[3], 0.01));
    iso(4471, () => {
      hedge('site', -10, 36, 0.01, 0.95, SF + 0.4, SF + 1.1);
      hedge('site', 40, 64, 0.01, 0.9, SF + 0.8, SF + 1.45);
      hedge('site', -14, 2.5, 0.01, 1.1, 45.0, 45.6);
      hedge('site', 59, 65.4, 0.01, 1.1, 45.0, 45.6);
      [[-9, 42.6], [-3.5, 40.4], [62.2, 41.5], [-30, SF + 2.1]].forEach((q) => tree('site', q[0], 0.01, q[1], 6.2 + rnd() * 1.2, 2.0, 'plane', true));
      [[-12, 39.5], [0.5, 44], [60.5, 39], [44, SF + 2.6], [52, SF + 2.2], [-22, SF + 2.4]].forEach((q) => shrub('site', q[0], 0.01, q[1], 0.6 + rnd() * 0.3, 0.9 + rnd() * 0.4, 0.3));
      for (let x = 24.4; x < 36.2; x += 2.5) box('site', 'zebra', x, x + 0.1, 0.002, 0.009, 39.2, 44.2);
      box('site', 'zebra', 24.4, 36.3, 0.002, 0.009, 44.1, 44.2);
    });
    // light trees: street rows, the Chiaradia park and the inner courtyards
    // street rows, the Chiaradia park and the courtyards: the same plane trees, with a lighter card budget
    const treeLite = (gk, x, y, z, h, r) => tree(gk, x, y, z, h, r, 'plane', true);
    for (let z = -37; z < 6; z += 8.5) { treeLite('site', RIP0 - 1.3, 0.15, z, 11, 3.0); treeLite('site', RIP1 + 1.8, 0.15, z + 4, 11, 3.0); }
    [[-6, 0.4], [-20, 0.3], [-33, 0.45]].forEach((q) => { treeLite('site', xW(q[0]) - 20, 0.08, q[0], 9 + q[1] * 4, 2.8); treeLite('site', xW(q[0] + 6) - 23.5, 0.08, q[0] + 6, 8, 2.5); });
    [[26, -24.5], [32, -25.2], [38.5, -24.2], [44, -15], [58, -26.4], [66, -19]].forEach((q) => treeLite(q[1] < -24.8 && q[0] > 22 ? 'ctxN' : 'site', q[0], 0.02, q[1], 8, 2.4));
    [[-2, 36], [16, 35.6], [30, 36.5], [62, 36]].forEach((q) => treeLite('ctxS', q[0], 0.02, q[1], 9, 2.6));
    for (let z = 24; z < 46; z += 8.5) treeLite('site', RIP0 - 1.3, 0.15, z, 11, 3.0);
    [[-24, -20.5], [-2, -21.6], [4.5, -19.4], [24, -33.4], [52, -33.8], [70, -32.4]].forEach((q) => treeLite('site', q[0], 0.02, q[1], 8, 2.4));
    // ------------------------------------------------- underground garage (keyplan "primo / secondo piano interrato"): parking under the
    // garden, cellars along the street side, three cores, a helical ramp (r 3.6-7.9 m) at the north-east and the straight ramp
    // from the street gate. Shown in the x-ray garage mode; level -1 is cut back to its western half so level -2 reads.
    {
      const G = 'garage';
      const paints = ['carB', 'carC', 'carE', 'carA', 'carB', 'carD', 'carC', 'carF', 'carB', 'carE', 'carG'];
      const frustum = (mk, x, y0, y1, z, bw, bl, tw, tl, rotY) => {
        const g = new THREE.BoxGeometry(1, 1, 1), q = g.attributes.position;
        for (let i = 0; i < q.count; i++) { const top = q.getY(i) > 0; q.setXYZ(i, q.getX(i) * (top ? tw : bw), top ? y1 : y0, q.getZ(i) * (top ? tl : bl)); }
        if (rotY) g.rotateY(rotY);
        g.translate(x, 0, z); g.computeVertexNormals(); put(G, mk, g);
      };
      const car = (x, y, z, dirZ, mk, alongX) => {
        const r = alongX ? Math.PI / 2 : 0;
        frustum(mk, x, y + 0.3, y + 0.8, z, 1.78, 4.4, 1.72, 4.1, r);
        const off = -dirZ * 0.2;
        frustum('carGlass', x + (alongX ? off : 0), y + 0.8, y + 1.3, z + (alongX ? 0 : off), 1.62, 2.55, 1.34, 1.5, r);
        [[-0.79, 1.36], [0.79, 1.36], [-0.79, -1.36], [0.79, -1.36]].forEach((d) => { const w = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 20); w.rotateZ(Math.PI / 2); if (alongX) w.rotateY(Math.PI / 2); w.translate(x + (alongX ? d[1] : d[0]), y + 0.32, z + (alongX ? d[0] : d[1])); put(G, 'tyre', w); const hub = new THREE.CylinderGeometry(0.19, 0.19, 0.235, 16); hub.rotateZ(Math.PI / 2); if (alongX) hub.rotateY(Math.PI / 2); hub.translate(x + (alongX ? d[1] : d[0]), y + 0.32, z + (alongX ? d[0] : d[1])); put(G, 'alu', hub); });
        if (!alongX) {
          const fz = z + dirZ * 2.2, bz = z - dirZ * 2.2;
          box(G, 'gDark', x - 0.86, x + 0.86, y + 0.24, y + 0.42, Math.min(fz, fz + dirZ * 0.1), Math.max(fz, fz + dirZ * 0.1));
          box(G, 'gDark', x - 0.86, x + 0.86, y + 0.24, y + 0.42, Math.min(bz, bz - dirZ * 0.1), Math.max(bz, bz - dirZ * 0.1));
          [-0.62, 0.62].forEach((d) => {
            box(G, 'gLamp', x + d - 0.2, x + d + 0.2, y + 0.6, y + 0.68, Math.min(fz - dirZ * 0.12, fz + dirZ * 0.01), Math.max(fz - dirZ * 0.12, fz + dirZ * 0.01));
            box(G, 'tail', x + d - 0.22, x + d + 0.22, y + 0.62, y + 0.7, Math.min(bz + dirZ * 0.1, bz - dirZ * 0.01), Math.max(bz + dirZ * 0.1, bz - dirZ * 0.01));
            box(G, mk, x + d * 1.5 - 0.05, x + d * 1.5 + 0.05, y + 0.86, y + 0.98, z + dirZ * 0.85 - 0.08, z + dirZ * 0.85 + 0.08);
          });
        }
      };
      const column = (x, z, fy, top) => {
        box(G, 'gConc', x - 0.2, x + 0.2, fy, top, z - 0.2, z + 0.2);
        for (let k = 0; k < 4; k++) box(G, k % 2 ? 'gDark' : 'gStripe', x - 0.205, x + 0.205, fy + 0.1 + k * 0.22, fy + 0.32 + k * 0.22, z - 0.205, z + 0.205);
      };
      const LVG = [{ y: -3.12, c: -0.35, xMax: 3.3 }, { y: -5.98, c: -3.42, xMax: 35.5 }];
      const OUT = [[-31, 6.3], [-31, -4.6], [-25.6, -4.6], [-25.6, -9.9], [-20.2, -9.9], [-20.2, -15.6], [11.5, -15.9], [11.5, -10.0], [19.0, -10.0], [21.0, -12.9], [24.0, -15.0], [27.5, -15.8], [31.0, -15.0], [33.9, -12.9], [35.3, -9.8], [35.5, -6.8], [35.5, 6.3]];
      const slab = (pts, y, xMax) => {
        const sh = new THREE.Shape(pts.map((p) => new THREE.Vector2(Math.min(p[0], xMax), -p[1])));
        const g = new THREE.ExtrudeGeometry(sh, { depth: 0.3, bevelEnabled: false }); g.rotateX(-Math.PI / 2); g.translate(0, y - 0.3, 0); put(G, 'gFloor', g);
      };
      LVG.forEach((L, li) => {
        const fy = L.y, top = L.c, xm = L.xMax;
        slab(OUT, fy, xm);
        // perimeter walls (north side and west side) and cores
        box(G, 'gConc', -20.2, Math.min(11.5, xm), fy, top, -15.9, -15.6);
        box(G, 'gConc', -20.5, -20.2, fy, top, -15.6, -9.9);
        box(G, 'gConc', -31, -30.7, fy, top, -4.6, 6.3);
        [[-19.8, -14.0], [-2.4, 3.4], [14.9, 20.4]].forEach((c) => { if (c[1] <= xm + 0.2) box(G, 'gConc', c[0], c[1], fy, top, -4.6, 0.4); });
        // parking: a row along the north wall, a row facing the cores, cellars along the street side
        for (let x = -19.8; x + 2.5 <= Math.min(11.4, xm); x += 2.5) {
          box(G, 'gLine', x - 0.04, x + 0.04, fy + 0.003, fy + 0.012, -15.5, -10.6);
          if (rnd() < 0.7) car(x + 1.25, fy, -13.05, -1, paints[(rnd() * paints.length) | 0]);
        }
        [[-14.0, -2.4], [3.4, 14.9], [20.4, 32.8]].forEach((r) => {
          if (r[0] >= xm) return;
          for (let x = r[0]; x + 2.5 <= Math.min(r[1], xm); x += 2.5) {
            box(G, 'gLine', x - 0.04, x + 0.04, fy + 0.003, fy + 0.012, -4.6, 0.3);
            if (rnd() < 0.62) car(x + 1.25, fy, -2.15, 1, paints[(rnd() * paints.length) | 0]);
          }
        });
        const ax1 = Math.min(32.8, xm);
        box(G, 'gAisle', -19.8, ax1, fy + 0.001, fy + 0.006, -10.6, -4.6);
        for (let x = -19.4; x + 1.2 <= ax1; x += 2.4) box(G, 'gLine', x, x + 1.2, fy + 0.006, fy + 0.012, -7.66, -7.54);
        box(G, 'gLine', -19.8, ax1, fy + 0.006, fy + 0.012, -10.62, -10.52);
        box(G, 'gLine', -19.8, ax1, fy + 0.006, fy + 0.012, -4.68, -4.58);
        for (let x = -19.8; x <= Math.min(11.4, xm) + 0.01; x += 7.5) column(x, -10.8, fy, top);
        for (let x = -19.8; x + 2.5 <= Math.min(11.4, xm); x += 2.5) box(G, 'gStripe', x + 0.55, x + 1.95, fy, fy + 0.11, -15.3, -15.12);
        for (let x = -18.6; x < ax1 - 0.6; x += 3.75) [-8.9, -6.3].forEach((z) => { box(G, 'gDuct', x - 0.62, x + 0.62, top - 0.11, top - 0.05, z - 0.1, z + 0.1); box(G, 'gLamp', x - 0.58, x + 0.58, top - 0.12, top - 0.11, z - 0.06, z + 0.06); });
        { const pl = ax1 + 19.8, pg = new THREE.CylinderGeometry(0.05, 0.05, pl, 10); pg.rotateZ(Math.PI / 2); pg.translate((ax1 - 19.8) / 2, top - 0.3, -7.6); put(G, 'gPipe', pg);
          const dg = new THREE.BoxGeometry(pl, 0.35, 0.6); dg.translate((ax1 - 19.8) / 2, top - 0.42, -11.6); put(G, 'gDuct', dg);
          for (let x = -18.6; x < ax1; x += 3.0) { box(G, 'gPipe', x - 0.02, x + 0.02, top - 0.3, top - 0.18, -7.62, -7.58); box(G, 'gDuct', x - 0.03, x + 0.03, top - 0.42, top - 0.18, -11.62, -11.58); } }
        [[-19.8, -14.0], [-2.4, 3.4], [14.9, 20.4]].forEach((c) => { if (c[1] <= xm + 0.2) { const mx = (c[0] + c[1]) / 2; box(G, 'gExit', mx - 0.28, mx + 0.28, top - 0.62, top - 0.4, -4.64, -4.6); box(G, 'frame', c[0] + 1.6, c[0] + 2.6, fy, fy + 2.1, -4.63, -4.6); } });
        box(G, 'gConc', -30.5, Math.min(32.8, xm), fy, fy + 2.3, 1.9, 6.0);
        for (let x = -30.5; x < Math.min(32.8, xm) - 2.0; x += 2.3) box(G, 'frame', x + 0.5, x + 1.4, fy + 0.02, fy + 2.0, 1.86, 1.9);

      });
      // garage detailing (deterministic, no random draws): wheel stops, floor arrows, crossings at the cores, EV wallboxes, extinguishers, bollards
      LVG.forEach((L) => {
        const fy = L.y, top = L.c, xm = L.xMax, ax1 = Math.min(32.8, xm);
        [[-14.0, -2.4], [3.4, 14.9], [20.4, 32.8]].forEach((r) => {
          if (r[0] >= xm) return;
          for (let x = r[0]; x + 2.5 <= Math.min(r[1], xm); x += 2.5) box(G, 'gStripe', x + 0.55, x + 1.95, fy, fy + 0.11, -0.05, 0.13);
        });
        const arrow = (x, z, dir) => {
          const s = new THREE.Shape([[-1.3, -0.11], [0.35, -0.11], [0.35, -0.38], [1.3, 0], [0.35, 0.38], [0.35, 0.11], [-1.3, 0.11]].map((p) => new THREE.Vector2(p[0] * dir, p[1])));
          const g = new THREE.ShapeGeometry(s); g.rotateX(-Math.PI / 2); g.translate(x, fy + 0.014, z); put(G, 'gLine', g);
        };
        for (let x = -15.5; x < ax1 - 2; x += 10) { arrow(x, -9.1, 1); arrow(x + 5, -6.1, -1); }
        [[-19.8, -14.0], [-2.4, 3.4], [14.9, 20.4]].forEach((c) => {
          if (c[1] > xm + 0.2) return;
          const dx = c[0] + 2.1;
          for (let z = -10.45; z < -4.8; z += 0.9) box(G, 'gLine', dx - 1.4, dx + 1.4, fy + 0.007, fy + 0.014, z, z + 0.45);
          [dx - 1.75, dx + 1.75].forEach((bx) => { const b = new THREE.CylinderGeometry(0.09, 0.09, 0.95, 16); b.translate(bx, fy + 0.475, -4.9); put(G, 'gStripe', b); const r = new THREE.CylinderGeometry(0.095, 0.095, 0.12, 16); r.translate(bx, fy + 0.68, -4.9); put(G, 'gDark', r); });
        });
        for (let x = -19.8, i = 0; x + 2.5 <= Math.min(11.4, xm); x += 2.5, i++) {
          if (i % 3) continue;
          box(G, 'gDark', x + 0.95, x + 1.55, fy + 0.95, fy + 1.6, -15.6, -15.42);
          box(G, 'gLamp', x + 1.15, x + 1.35, fy + 1.42, fy + 1.48, -15.43, -15.41);
          box(G, 'gStripe', x + 0.3, x + 2.2, fy + 0.012, fy + 0.02, -12.4, -11.6);
        }
        for (let x = -19.8; x <= Math.min(11.4, xm) + 0.01; x += 15) box(G, 'tail', x - 0.11, x + 0.11, fy + 0.85, fy + 1.4, -10.62, -10.55);
      });
      // helical ramp: two turns from the street ramp (-1.6) down to level -2, walled to the north and east
      {
        const cx = 27.5, cz = -7.86, r0 = 3.85, r1 = 7.6, a0 = 0.45, turns = 1.55, yA = -1.75, yB = -5.98;
        const N = 120, pos = [], idx = [];
        for (let i = 0; i <= N; i++) {
          const t = i / N, a = a0 - t * turns * Math.PI * 2, y = yA + (yB - yA) * t;
          pos.push(cx + Math.cos(a) * r0, y, cz + Math.sin(a) * r0, cx + Math.cos(a) * r1, y, cz + Math.sin(a) * r1);
          if (i < N) { const k = i * 2; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
        g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(pos.length / 3 * 2), 2));
        const g2 = g.clone(); g2.translate(0, -0.25, 0);
        put(G, 'gFloor', g); put(G, 'gConc', g2);
        const kerb = (r, rr) => { const kp = [], ki = []; for (let i = 0; i <= N; i++) { const t = i / N, a = a0 - t * turns * Math.PI * 2, y = yA + (yB - yA) * t; kp.push(cx + Math.cos(a) * r, y, cz + Math.sin(a) * r, cx + Math.cos(a) * r, y + 0.22, cz + Math.sin(a) * r); if (i < N) { const k = i * 2; ki.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); } } const kg = new THREE.BufferGeometry(); kg.setAttribute('position', new THREE.Float32BufferAttribute(kp, 3)); kg.setIndex(ki); kg.computeVertexNormals(); kg.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(kp.length / 3 * 2), 2)); put(G, rr, kg); };
        kerb(r0 + 0.02, 'gStripe'); kerb(r1 - 0.02, 'gStripe');
        const core = new THREE.CylinderGeometry(3.6, 3.6, 6.3, 40); core.translate(cx, -3.15, cz); put(G, 'gConc', core);
        const wall = new THREE.CylinderGeometry(7.9, 7.9, 6.3, 48, 1, true, Math.PI * 0.15, Math.PI * 1.05); wall.translate(cx, -3.15, cz); put(G, 'gConc', wall);
        for (let i = 0; i < N; i += 6) { const t = i / N, a = a0 - t * turns * Math.PI * 2, y = yA + (yB - yA) * t; box(G, 'light', cx + Math.cos(a) * 5.7 - 0.08, cx + Math.cos(a) * 5.7 + 0.08, y + 0.005, y + 0.02, cz + Math.sin(a) * 5.7 - 0.08, cz + Math.sin(a) * 5.7 + 0.08); }
      }
      // straight ramp from the street gate down to the helix
      {
        const L = Math.hypot(ZF - HZ0, 1.75), g = new THREE.BoxGeometry(HX1 - HX0 - 0.1, 0.25, L);
        g.rotateX(-Math.atan2(1.75, ZF - HZ0)); g.translate((HX0 + HX1) / 2, -0.875 - 0.125, (ZF + HZ0) / 2);
        put('site', 'asphalt', g);
        for (let z = ZF - 1.0; z > HZ0; z -= 1.6) { const y = -1.75 * (ZF - z) / (ZF - HZ0); box('site', 'light', HX0 + 0.05, HX0 + 0.12, y + 0.4, y + 0.46, z - 0.3, z); }
      }
    }
    // street life:    // street life: parked cars, street lamps, zebra crossing, garden benches
    const lamp = (x, z, d) => {
      d = d || -1;
      const zA = Math.min(z, z + d * 1.55), zB = Math.max(z, z + d * 1.55), hA = Math.min(z + d * 1.3, z + d * 2.0), hB = Math.max(z + d * 1.3, z + d * 2.0);
      cyl('site', 'frame', x, 0.15, 0.6, z, 0.13);
      cyl('site', 'frame', x, 0.6, 4.0, z, 0.075);
      cyl('site', 'frame', x, 4.0, 7.2, z, 0.055);
      box('site', 'frame', x - 0.04, x + 0.04, 7.08, 7.16, zA, zB);
      box('site', 'frame', x - 0.29, x + 0.29, 6.94, 7.08, hA, hB);
      box('site', 'frame', x - 0.31, x + 0.31, 7.06, 7.1, hA - 0.02, hB + 0.02);
      quadY('site', 'light', x - 0.25, x + 0.25, hA + 0.05, hB - 0.05, 6.935, true);
    };
    [-44, -22, 22, 44, 68].forEach((x) => lamp(x, 19.0, -1));
    [-56, 52, 84].forEach((x) => lamp(x, 9.0, 1));
    // street life on Via Pasinetti: parallel-parked cars on both curbs (kept clear of the entrance and the garage ramp),
    // plane trees in grated pits beyond the building, bollards along the building-side curb, bike racks by the entrance
    // parked cars, built once per body style and placed by copy. Side profile (bumpers, bonnet, wheel arches cut down to the
    // sill, belt line, boot or tailgate) extruded with a two-step rounded edge and smoothed normals; the flanks lean in a little
    // and the glasshouse leans in more (tumblehome), so the dark glass sits back from the shoulder. A painted roof skin, black
    // B-pillars, door shut-lines, dark wheel wells behind the tyres, alloy rims, lamp clusters, grille and white number plates.
    const CARS = (() => {
      const ext = (shape, depth, bev, segs) => {
        const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: bev > 0, bevelThickness: bev, bevelSize: bev, bevelSegments: segs || 2, curveSegments: 6 });
        g.translate(0, 0, -depth / 2); return g;
      };
      // linear lean-in with height: keeps the flat sides planar (only z changes, linearly in y)
      const lean = (g, ya, yb, ka, kb) => { const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const t = (p.getY(i) - ya) / (yb - ya); p.setZ(i, p.getZ(i) * (ka + (kb - ka) * t)); } return g; };
      // smooth shading across the rounded edges, crisp where faces meet at more than `deg`
      const smooth = (g, deg) => {
        g.computeVertexNormals();
        const p = g.attributes.position, n = g.attributes.normal, c = Math.cos(deg * Math.PI / 180), groups = new Map(), out = new Float32Array(p.count * 3);
        for (let i = 0; i < p.count; i++) { const k = Math.round(p.getX(i) * 400) + '|' + Math.round(p.getY(i) * 400) + '|' + Math.round(p.getZ(i) * 400); let a = groups.get(k); if (!a) groups.set(k, a = []); a.push(i); }
        groups.forEach((a) => a.forEach((i) => {
          let sx = 0, sy = 0, sz = 0; const ax = n.getX(i), ay = n.getY(i), az = n.getZ(i);
          a.forEach((j) => { const bx = n.getX(j), by = n.getY(j), bz = n.getZ(j); if (ax * bx + ay * by + az * bz >= c) { sx += bx; sy += by; sz += bz; } });
          const l = Math.hypot(sx, sy, sz) || 1; out[i * 3] = sx / l; out[i * 3 + 1] = sy / l; out[i * 3 + 2] = sz / l;
        }));
        g.setAttribute('normal', new THREE.BufferAttribute(out, 3)); return g;
      };
      const bx = (x0, x1, y0, y1, z0, z1) => { const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0); g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); return g; };
      const make = (o) => {
        const L = o.L, W = o.W, H = o.H, wr = o.wr, sill = o.sill, belt = o.belt, beltR = o.beltR, bonY = o.bonY;
        const xf = L / 2, xr = -L / 2, axF = xf - o.fo, axR = axF - o.WB, ar = wr + 0.075, d = Math.asin(Math.max(0, Math.min(0.9, (wr - sill) / ar)));
        const xw = xf - o.bonL, xt = xw - o.rake, xrr = xr + o.roofR, boot = o.back === 'boot', xc = xr + (o.deck || 0);
        // body side profile, from the rear bumper along the sill and over both wheels, up the nose, back along bonnet and belt
        const s = new THREE.Shape();
        s.moveTo(xr + 0.18, sill + 0.05);
        s.lineTo(axR - ar * Math.cos(d), sill); s.absarc(axR, wr, ar, Math.PI + d, -d, true);
        s.lineTo(axF - ar * Math.cos(d), sill); s.absarc(axF, wr, ar, Math.PI + d, -d, true);
        s.lineTo(xf - 0.18, sill + 0.05);
        s.quadraticCurveTo(xf - 0.02, sill + 0.07, xf, 0.45);
        s.quadraticCurveTo(xf + 0.015, bonY - 0.1, xf - 0.09, bonY);
        s.quadraticCurveTo(xf - o.bonL * 0.45, bonY + 0.09, xw, belt);
        if (boot) { s.lineTo(xc + 0.06, beltR); s.quadraticCurveTo(xc - 0.05, o.bootY, xc - 0.2, o.bootY); s.lineTo(xr + 0.14, o.bootY - 0.01); s.quadraticCurveTo(xr - 0.02, o.bootY - 0.03, xr - 0.01, o.bootY - 0.28); }
        else { s.lineTo(xr + 0.12, beltR); s.quadraticCurveTo(xr - 0.03, beltR - 0.02, xr - 0.015, beltR - 0.3); }
        s.quadraticCurveTo(xr - 0.005, sill + 0.08, xr + 0.18, sill + 0.05);
        // glasshouse
        const gh = new THREE.Shape();
        gh.moveTo(xw + 0.03, belt - 0.03);
        gh.quadraticCurveTo(xw - o.rake * 0.5, belt + (H - belt) * 0.72, xt, H - 0.01);
        gh.lineTo(xrr, H - 0.03);
        if (boot) gh.quadraticCurveTo(xrr - 0.32, H - 0.07, xc + 0.02, o.bootY - 0.02);
        else gh.quadraticCurveTo(xr + 0.1, H - 0.08, xr + 0.12, beltR - 0.03);
        gh.lineTo(xw + 0.03, belt - 0.03);
        // painted roof skin over the top of the glasshouse
        const rf = new THREE.Shape();
        rf.moveTo(xt + 0.05, H - 0.03); rf.lineTo(xrr + 0.03, H - 0.05); rf.lineTo(xrr + 0.03, H + 0.001); rf.lineTo(xt + 0.05, H + 0.021); rf.lineTo(xt + 0.05, H - 0.03);
        const gLean = (g, extra) => lean(g, belt, H, 0.965 * extra, 0.78 * extra);
        const bodyG = smooth(lean(ext(s, W - 0.08, 0.04, 2), sill, belt, 1.0, 0.965), 38);
        const glassG = smooth(gLean(ext(gh, W - 0.24, 0.05, 2), 1), 38);
        const roofG = smooth(gLean(ext(rf, W - 0.14, 0.025, 2), 1), 40);
        const g = { paint: [bodyG, roofG], glass: [glassG], trim: [], tyre: [], rim: [], lamp: [], tail: [], plate: [] };
        // pillars: black B-pillar, body-colour C-pillar (full-width bands, a few mm proud of the side glass); door shut-lines
        const x1 = Math.min(xw + 0.05, axF - ar - 0.05), xb = x1 - (o.doors === 3 ? 1.15 : 0.99);
        const band = (pts) => { const sh = new THREE.Shape(); sh.moveTo(pts[0][0], pts[0][1]); pts.slice(1).forEach((q) => sh.lineTo(q[0], q[1])); sh.lineTo(pts[0][0], pts[0][1]); return gLean(ext(sh, W - 0.14 + 0.012, 0, 1), 1); };
        g.trim.push(band([[xb - 0.05, belt - 0.02], [xb + 0.05, belt - 0.02], [xb, H - 0.04], [xb - 0.1, H - 0.04]]));
        if (boot) g.paint.push(band([[xc + 0.1, beltR - 0.02], [xc + 0.5, beltR - 0.02], [xrr + 0.2, H - 0.04], [xrr - 0.04, H - 0.04]]));
        else g.paint.push(band([[xr + 0.22, beltR - 0.02], [xr + 0.62, beltR - 0.02], [xrr + 0.3, H - 0.04], [xrr + 0.04, H - 0.04]]));
        [x1, xb - 0.02, o.doors === 3 ? null : axR + ar + 0.05].forEach((x) => { if (x === null) return; g.trim.push(lean(bx(x - 0.004, x + 0.004, sill + 0.09, belt - 0.05, -W / 2 - 0.003, W / 2 + 0.003), sill, belt, 1.0, 0.965)); });
        // wheels: dark wheel wells, tyres, alloy rims standing a few mm proud of the sidewall
        const zt = W / 2 - 0.125;
        [axF, axR].forEach((ax) => {
          g.trim.push(bx(ax - ar + 0.03, ax + ar - 0.03, wr - 0.02, wr + ar - 0.02, -(W / 2 - 0.07), W / 2 - 0.07));
          [-1, 1].forEach((sd) => {
            const t = new THREE.CylinderGeometry(wr, wr, 0.21, 20); t.rotateX(Math.PI / 2); t.translate(ax, wr, sd * zt); g.tyre.push(t);
            const r = new THREE.CylinderGeometry(wr * 0.66, wr * 0.66, 0.216, 16); r.rotateX(Math.PI / 2); r.translate(ax, wr, sd * zt); g.rim.push(r);
          });
        });
        // lamps, grille, number plates, black mirror housings
        [-1, 1].forEach((sd) => {
          g.lamp.push(bx(xf - 0.12, xf + 0.055, bonY - 0.13, bonY - 0.04, sd * (W / 2 - 0.44), sd * (W / 2 - 0.1)));
          const ty = boot ? o.bootY - 0.15 : beltR - 0.17;
          g.tail.push(bx(xr - 0.075, xr + 0.08, ty - 0.06, ty + 0.06, sd * (W / 2 - 0.42), sd * (W / 2 - 0.09)));
          g.trim.push(bx(xw - 0.17, xw - 0.07, belt + 0.04, belt + 0.12, sd * (W / 2 - 0.02), sd * (W / 2 + 0.1)));
        });
        g.trim.push(bx(xf - 0.08, xf + 0.055, 0.36, 0.56, -0.42, 0.42));
        g.plate.push(bx(xf + 0.055, xf + 0.067, 0.39, 0.5, -0.26, 0.26));
        g.plate.push(bx(xr - 0.08, xr - 0.066, 0.5, 0.61, -0.26, 0.26));
        return g;
      };
      return [
        // five-door hatchback
        make({ L: 4.2, W: 1.78, H: 1.46, wr: 0.32, sill: 0.24, belt: 0.97, beltR: 1.0, bonY: 0.79, fo: 0.86, WB: 2.62, bonL: 1.2, rake: 0.86, roofR: 0.42 }),
        // saloon with a boot
        make({ L: 4.65, W: 1.8, H: 1.44, wr: 0.33, sill: 0.25, belt: 0.95, beltR: 0.98, bonY: 0.77, fo: 0.9, WB: 2.74, bonL: 1.3, rake: 0.9, roofR: 1.25, back: 'boot', deck: 0.6, bootY: 1.0 }),
        // small three-door city car, upright and short
        make({ L: 3.65, W: 1.66, H: 1.53, wr: 0.3, sill: 0.25, belt: 0.98, beltR: 1.02, bonY: 0.82, fo: 0.68, WB: 2.3, bonL: 0.86, rake: 0.72, roofR: 0.3, doors: 3 })
      ];
    })();
    const sCar = (x, z, mk, dir) => {
      const r = rnd(), c = CARS[r < 0.45 ? 0 : r < 0.75 ? 1 : 2], yaw = (rnd() - 0.5) * 0.03, dz = (rnd() - 0.5) * 0.1;
      const place = (list, m) => list.forEach((gg) => { const q = gg.clone(); q.rotateY((dir < 0 ? Math.PI : 0) + yaw); q.translate(x, 0.0, z + dz); put('site', m, q); });
      place(c.paint, mk); place(c.glass, 'carGlass'); place(c.trim, 'trim'); place(c.tyre, 'tyre'); place(c.rim, 'rim'); place(c.lamp, 'headL'); place(c.tail, 'tail'); place(c.plate, 'zebra');
    };
    const CARP = ['carB', 'carC', 'carE', 'carA', 'carB', 'carD', 'carC', 'carF', 'carG'];
    iso(913, () => {
      for (let x = -58; x < 72; x += 6.2 + rnd() * 2.4) if (rnd() < 0.28) sCar(x, 16.55, CARP[(rnd() * CARP.length) | 0], -1);
      for (let x = -58; x < 72; x += 6.2 + rnd() * 2.4) { if ((x > -10 && x < 10) || (x > 26 && x < 42)) continue; if (rnd() < 0.2) sCar(x, 10.5, CARP[(rnd() * CARP.length) | 0], 1); }
      [-74, -63, -52, -40, 40, 51, 62, 74].forEach((x) => {
        box('site', 'frame', x - 0.6, x + 0.6, 0.0, 0.03, 18.1, 19.3);
        tree('site', x, 0.03, 18.7, 7.5 + rnd() * 2, 2.4 + rnd() * 0.6, 'plane');
      });
      for (let x = -30; x < 30; x += 2.4) { if (x > -6 && x < 6) continue; cyl('site', 'frame', x, 0.0, 0.85, 9.25, 0.07); }
      [-7.2, 7.2].forEach((x) => [0, 0.7, 1.4].forEach((d) => { const g = new THREE.TorusGeometry(0.38, 0.025, 6, 20, Math.PI); g.translate(x + d * (x < 0 ? -1 : 1), 0.0, 8.7); put('site', 'frame', g); }));
    });
    const bench = (x, z, rot) => {
      const a = rot ? [z - 0.9, z + 0.9, x - 0.22, x + 0.22] : [x - 0.9, x + 0.9, z - 0.22, z + 0.22];
      if (rot) { box('site', 'trunk', a[2], a[3], 1.62, 1.68, a[0], a[1]); [a[0] + 0.15, a[1] - 0.15].forEach((q) => box('site', 'frame', x - 0.2, x + 0.2, 1.2, 1.62, q - 0.03, q + 0.03)); }
      else { box('site', 'trunk', a[0], a[1], 1.62, 1.68, a[2], a[3]); [a[0] + 0.15, a[1] - 0.15].forEach((q) => box('site', 'frame', q - 0.03, q + 0.03, 1.2, 1.62, z - 0.2, z + 0.2)); }
    };
    const GN = -16.3, yG = 1.2;
    // raised courtyard and its north boundary (keyplan property line)
    box('site', 'stone', X0, 31.0, -0.02, yG, GN, -4.6);
    box('site', 'stone', 31.0, 36.6, -0.02, yG, GN, HZ0);
    box('site', 'plaster', X0, 36.85, yG, yG + 0.9, GN - 0.3, GN);
    box('site', 'slab', X0, 36.85, yG + 0.9, yG + 0.98, GN - 0.36, GN + 0.04);
    box('site', 'plaster', 36.6, 36.85, -0.02, 2.3, HZ0, ZF);
    quadY('site', 'paving', X0, -18.6, GN, -4.6, yG + 0.005);
    quadY('site', 'grass', -18.6, 31.0, GN, -6.6, yG + 0.005);
    quadY('site', 'paving', -18.6, 31.0, -6.6, -4.6, yG + 0.005);
    quadY('site', 'grass', 31.0, 36.6, GN, HZ0, yG + 0.005);
    // planted edge along the boundary and the west lawn
    hedge('site', -19.9, 11.6, yG, yG + 0.85, GN + 0.1, GN + 0.9);
    hedge('site', -19.9, -18.7, yG, yG + 0.85, GN + 0.9, -10.2);
    // cafe terrace (north-west): five bistro tables and a light pergola with lounge chairs
    [[-28.5, -13.2], [-25.5, -12.0], [-21.9, -13.1], [-28.5, -9.7], [-27.2, -6.4]].forEach((q) => table('site', q[0], yG, q[1], 0.42, 4));
    {
      const x0 = -24.8, x1 = -20.2, z0 = -10.1, z1 = -5.0;
      pergola('site', x0, x1, z0, z1, yG, yG + 2.9, { posts: [x0, x1] });
      cards('site', (x0 + x1) / 2, yG + 2.98, (z0 + z1) / 2, (x1 - x0) / 2, 0.18, (z1 - z0) / 2, 150, CELLS.leaf.concat(CELLS.flower), 0.28, 0.46);
      box('site', 'deck', x0 + 0.1, x1 - 0.1, yG, yG + 0.08, z0 + 0.1, z1 - 0.1);
      [[-22.5, -8.6], [-22.5, -6.1]].forEach((q) => {
        const t = new THREE.CylinderGeometry(0.35, 0.35, 0.4, 20); t.translate(q[0], yG + 0.28, q[1]); put('site', 'slab', t);
        armchair('site', q[0] - 1.05, yG + 0.08, q[1], 1); armchair('site', q[0] + 1.05, yG + 0.08, q[1], 1);
      });
    }
    // outdoor co-working pergola and outdoor fitness pergola, both wrapped in climbers (garden renders)
    const gPerg = (x0, x1, z0, z1) => {
      pergola('site', x0, x1, z0, z1, yG, yG + 3.0, { posts: [x0, (x0 + x1) / 2, x1] });
      cards('site', (x0 + x1) / 2, yG + 3.08, (z0 + z1) / 2, (x1 - x0) / 2, 0.24, (z1 - z0) / 2, 560, CELLS.leaf, 0.3, 0.5);
      [z0, z1].forEach((z) => cards('site', (x0 + x1) / 2, yG + 2.55, z, (x1 - x0) / 2, 0.45, 0.14, 120, CELLS.leaf.concat(CELLS.flower), 0.2, 0.34));
      [x0, (x0 + x1) / 2, x1].forEach((x) => [z0, z1].forEach((z) => cards('site', x, yG + 1.6, z, 0.24, 1.4, 0.24, 54, CELLS.leaf.concat(CELLS.flower), 0.22, 0.36)));
      box('site', 'deck', x0 + 0.1, x1 - 0.1, yG, yG + 0.1, z0 + 0.1, z1 - 0.1);
    };
    gPerg(-10.9, -2.15, -12.4, -8.3);
    table('site', -8.6, yG + 0.1, -10.3, 0.55, 4); table('site', -4.5, yG + 0.1, -10.3, 0.55, 4);
    box('site', 'cushion', -10.4, -9.6, yG + 0.1, yG + 0.5, -11.9, -8.8);
    gPerg(3.2, 11.7, -12.4, -8.3);
    [[5.2, -10.3], [7.6, -11.2], [9.9, -9.6]].forEach((q, i) => {
      const pad = new THREE.CylinderGeometry(0.95, 0.95, 0.05, 32); pad.translate(q[0], yG + 0.13, q[1]); put('site', 'paving', pad);
      if (i === 0) { [-0.6, 0.6].forEach((d) => box('site', 'frame', q[0] + d - 0.05, q[0] + d + 0.05, yG + 0.1, yG + 2.35, q[1] - 0.05, q[1] + 0.05)); box('site', 'frame', q[0] - 0.65, q[0] + 0.65, yG + 2.25, yG + 2.35, q[1] - 0.04, q[1] + 0.04); }
      else { cyl('site', 'frame', q[0], yG + 0.1, yG + 1.4, q[1], 0.07); box('site', 'frame', q[0] - 0.45, q[0] + 0.45, yG + 0.45, yG + 0.52, q[1] - 0.05, q[1] + 0.05); box('site', 'frame', q[0] - 0.04, q[0] + 0.04, yG + 0.8, yG + 1.4, q[1] - 0.4, q[1] + 0.4); }
    });
    // benches and planters on the lawn
    bench(-15.2, -12.4, false); bench(-0.4, -13.6, false); bench(14.6, -13.6, false); bench(-15.8, -9.0, true);
    [[-14.3, -14.2], [0.4, -14.2], [13.8, -14.4], [18.6, -11.4]].forEach((q) => shrub('site', q[0], yG + 0.1, q[1], 0.6, 0.85, 0.5));
    // rotunda over the core of the helical car ramp
    {
      const cx = 27.5, cz = -8.0;
      const ring = new THREE.CylinderGeometry(3.75, 3.75, 0.5, 48, 1, true); ring.translate(cx, yG + 0.25, cz); put('site', 'stone', ring);
      const ring2 = new THREE.CylinderGeometry(3.4, 3.4, 0.5, 48, 1, true); ring2.translate(cx, yG + 0.25, cz); put('site', 'stone', ring2);
      const top = new THREE.RingGeometry(3.4, 3.75, 48); top.rotateX(-Math.PI / 2); top.translate(cx, yG + 0.5, cz); put('site', 'slab', top);
      const lawn = new THREE.CircleGeometry(3.4, 48); lawn.rotateX(-Math.PI / 2); lawn.translate(cx, yG + 0.45, cz); put('site', 'grass', lawn);
      tree('site', cx, yG + 0.45, cz, 5.2, 1.7, 'olive');
      [0, 1.3, 2.6, 3.9, 5.2].forEach((a) => shrub('site', cx + Math.cos(a) * 2.4, yG + 0.45, cz + Math.sin(a) * 2.4, 0.5, 0.7, 0.6));
    }
    [[-16.4, -6.3], [-30.0, -15.4], [-6.4, -15.2], [6.6, -15.3], [19.8, -15.0], [33.6, -12.6], [33.4, -7.8]].forEach((t, i) => tree('site', t[0], yG, t[1], i < 2 ? 5.0 : 5.8, i < 2 ? 1.6 : 1.9, i === 0 || i === 3 ? 'olive' : ''));
    [[-20.6, -7.0], [-12.5, -7.6], [-1.0, -7.6], [12.4, -7.6], [22.0, -6.9], [-29.5, -5.5], [24.2, -12.6]].forEach((q) => blob('site', 'light', q[0], yG + 0.42, q[1], 0.38, 1));
    [[-16.4, -6.3], [-30.0, -15.4], [-6.4, -15.2], [6.6, -15.3], [19.8, -15.0], [33.6, -12.6], [33.4, -7.8]].forEach((q) => { cyl('site', 'frame', q[0] + 0.9, yG, yG + 0.16, q[1] + 0.5, 0.07); cyl('site', 'light', q[0] + 0.9, yG + 0.16, yG + 0.19, q[1] + 0.5, 0.055); });
    // car gate on Via Pasinetti and the walls of the ramp trench
    box('site', 'stone', 30.75, 31.15, -0.02, 2.75, ZF - 0.35, ZF);
    box('site', 'stone', 36.45, 36.85, -0.02, 2.75, ZF - 0.35, ZF);
    box('site', 'perg', 31.15, 36.45, 2.42, 2.55, ZF - 0.2, ZF - 0.08);
    for (let x = 31.25; x < 36.4; x += 0.14) box('site', 'perg', x, x + 0.06, 0.05, 2.42, ZF - 0.18, ZF - 0.1);
    box('site', 'stone', 31.0, 31.15, -3.6, yG + 0.9, HZ0, ZF - 0.35);
    box('site', 'stone', 36.45, 36.6, -3.6, 0.9, HZ0, ZF - 0.35);
    box('site', 'stone', HX0, HX1, -3.6, yG + 0.9, HZ0 - 0.3, HZ0);
    const eg = new THREE.BufferGeometry();
    eg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(edgePts), 3));
    const ctxEdges = new THREE.LineSegments(eg, new THREE.LineBasicMaterial({ color: 0xb9b2a6, transparent: true, opacity: 0.75 }));
    ctxEdges.visible = false;
    GROUPS.site.add(ctxEdges);
    const egN = new THREE.BufferGeometry();
    egN.setAttribute('position', new THREE.BufferAttribute(new Float32Array(edgeN), 3));
    const ctxNEdges = new THREE.LineSegments(egN, new THREE.LineBasicMaterial({ color: 0xb9b2a6, transparent: true, opacity: 0.75 }));
    ctxNEdges.visible = false;
    GROUPS.ctxN.add(ctxNEdges);
    // soft contact shadow of the plinth on the studio floor
    const shTex = tex(256, 256, (g, w, h) => {
      g.clearRect(0, 0, w, h);
      const gr = g.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2);
      gr.addColorStop(0, 'rgba(0,0,0,0.75)'); gr.addColorStop(0.55, 'rgba(0,0,0,0.45)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
    }, false);
    const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(300, 200), new THREE.MeshBasicMaterial({ map: shTex, transparent: true, depthWrite: false, opacity: 0.85 }));
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(24, -7.45, -5);
    shadowPlane.renderOrder = -0.5;
    scene.add(shadowPlane);

    // ------------------------------------------------- finalize buckets
    Object.keys(BUCKETS).forEach((k) => {
      const b = BUCKETS[k];
      const m = new THREE.Mesh(merge(b.list), (b.gk === 'ctxN' || b.gk === 'ctxS') ? MAT[b.mk].clone() : MAT[b.mk]);
      m.castShadow = !NO_SHADOW[b.mk];
      m.receiveShadow = b.mk !== 'light' && b.mk.indexOf('glassLit') !== 0;
      m.userData.mk = b.mk;
      m.matrixAutoUpdate = false;
      m.updateMatrix();
      GROUPS[b.gk].add(m);
      if (b.mk === 'rail' || b.mk === 'fol') railMeshes.push(m);
    });

    GROUPS.garage.visible = false;
    // ------------------------------------------------- studio backdrop, lights, moods
    // open sky: gradient + sun halo + procedural clouds + stars, also used for the reflections (PMREM)
    const skyU = {
      zen: { value: new THREE.Color() }, hor: { value: new THREE.Color() }, gnd: { value: new THREE.Color() },
      sunDir: { value: new THREE.Vector3(0, 1, 0) }, sunCol: { value: new THREE.Color() }, sunAmt: { value: 0 },
      cLit: { value: new THREE.Color() }, cDark: { value: new THREE.Color() }, cAmt: { value: 0.6 }, stars: { value: 0 }
    };
    const skyMat = new THREE.ShaderMaterial({
      uniforms: skyU, side: THREE.BackSide, depthWrite: false, fog: false, toneMapped: false,
      vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: [
        'uniform vec3 zen; uniform vec3 hor; uniform vec3 gnd; uniform vec3 sunDir; uniform vec3 sunCol; uniform float sunAmt;',
        'uniform vec3 cLit; uniform vec3 cDark; uniform float cAmt; uniform float stars; varying vec3 vP;',
        'float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }',
        'float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }',
        'float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ s += a * vn(p); p = p * 2.03 + vec2(17.1, 9.3); a *= 0.5; } return s; }',
        'void main(){',
        '  vec3 d = normalize(vP); float h = d.y;',
        '  vec3 c = h > 0.0 ? mix(hor, zen, pow(clamp(h, 0.0, 1.0), 0.36)) : mix(hor, gnd, smoothstep(0.0, 0.1, -h));',
        '  float mu = max(dot(d, normalize(sunDir)), 0.0);',
        '  float above = smoothstep(-0.04, 0.03, h);',
        '  c += sunCol * sunAmt * (pow(mu, 60.0) * 0.6 + pow(mu, 7.0) * 0.22) * above;',
        '  c += sunCol * sunAmt * 0.18 * pow(1.0 - abs(h), 6.0) * pow(mu, 2.0);',
        '  if (h > 0.0) {',
        '    vec2 uv = d.xz / (h + 0.1);',
        '    float n = fbm(uv * 1.35 + vec2(3.0, 7.0));',
        '    float cov = smoothstep(0.56 - cAmt * 0.25, 0.84 - cAmt * 0.15, n) * smoothstep(0.0, 0.07, h);',
        '    float sh = clamp(fbm(uv * 2.6 + 11.0) * 1.25 - 0.12, 0.0, 1.0);',
        '    vec3 cc = mix(cDark, cLit, sh) + sunCol * sunAmt * pow(mu, 6.0) * 0.45;',
        '    c = mix(c, cc, cov * 0.9);',
        '    float st = step(0.9965, h21(floor(d.xz / (h + 0.35) * 240.0))) * stars * smoothstep(0.06, 0.4, h) * (1.0 - cov);',
        '    c += vec3(st * 1.4);',
        '  }',
        '  gl_FragColor = vec4(c, 1.0);',
        '#include <colorspace_fragment>',
        '}'].join('\n')
    });
    const sky = new THREE.Mesh(new THREE.SphereGeometry(650, 48, 24), skyMat);
    sky.renderOrder = -1;
    scene.add(sky);
    scene.fog = new THREE.Fog(0xcfd8e2, 240, 1350);
    // soft ground plane that fades into the horizon haze
    const gndU = { near: { value: new THREE.Color() }, far: { value: new THREE.Color() } };
    const gndMat = new THREE.ShaderMaterial({
      uniforms: gndU, fog: false,
      vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: 'uniform vec3 near; uniform vec3 far; varying vec3 vW; void main(){ float r = length(vW.xz); vec3 c = mix(near, far, smoothstep(70.0, 560.0, r)); gl_FragColor = vec4(c, 1.0);\n#include <colorspace_fragment>\n}'
    });
    const ground = new THREE.Mesh(new THREE.CircleGeometry(640, 72), gndMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -7.5, -1);
    ground.renderOrder = -0.8;
    scene.add(ground);
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffffff, 2);
    sun.castShadow = true;
    // shadow map rendered only when the sun or the scene changes (autoUpdate off), so a large map costs memory, not frame time
    const shN = MOBILE ? 3072 : 4096;
    sun.shadow.mapSize.set(shN, shN);
    sun.shadow.radius = 3;
    const sc = sun.shadow.camera;
    sc.left = -92; sc.right = 92; sc.top = 92; sc.bottom = -92; sc.near = 20; sc.far = 580;   // tighter around the block: ~4.5 cm texels
    sun.shadow.bias = -0.0003;
    sun.shadow.normalBias = 0.035;
    sun.target.position.set(14, 6, -4);
    scene.add(sun); scene.add(sun.target);
    const rim = new THREE.DirectionalLight(0xffffff, 0.5);
    rim.target.position.set(0, 8, 0);
    scene.add(rim); scene.add(rim.target);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(sky.geometry, skyMat));
    const sbMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, toneMapped: false });
    [[-320, 230, 260, 300, 120], [360, 170, -180, 220, 90], [40, 420, 60, 260, 260]].forEach((b) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(b[3], b[4]), sbMat);
      m.position.set(b[0], b[1], b[2]); m.lookAt(0, 0, 0);
      envScene.add(m);
    });
    let envRT = null;
    const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    const col = (h) => new THREE.Color(h);
    const PAL = {
      night: { zen: col('#04070f'), hor: col('#16203a'), gnd: col('#0b0d13'), gn: col('#15171c'), hs: col('#5d6d8c'), hg: col('#141210'), hi: 0.55, sb: col('#3c4660'), rc: col('#8fa6d4'), cl: col('#232c40'), cd: col('#0e131e') },
      dusk: { zen: col('#203765'), hor: col('#f1a56d'), gnd: col('#5a4f47'), gn: col('#5e5750'), hs: col('#c3cde0'), hg: col('#38312b'), hi: 1.25, sb: col('#d8bfa8'), rc: col('#c9d5ea'), cl: col('#f6c49c'), cd: col('#6e5f78') },
      day: { zen: col('#3065ad'), hor: col('#c3d3e1'), gnd: col('#d2c9bd'), gn: col('#d8cfc3'), hs: col('#d6e6ff'), hg: col('#8c8378'), hi: 0.38, sb: col('#c9d6e6'), rc: col('#ffffff'), cl: col('#ffffff'), cd: col('#b3c0d0') }
    };
    const blend = (k, a, b) => PAL.night[k].clone().lerp(PAL.dusk[k], a).lerp(PAL.day[k], b);
    let orientDeg = 172;
    const SUN = { az: 300, el: -3 };
    const sunVec = (az, el) => {
      const d = (az - orientDeg) * Math.PI / 180, e = el * Math.PI / 180;
      return new THREE.Vector3(Math.cos(e) * -Math.sin(d), Math.sin(e), Math.cos(e) * Math.cos(d));
    };
    const GLASS_OFF = col('#b4bcc4'), GLASS_ON = col('#120d09');
    // daylight inside the rooms seen through the glass (unlit rooms), and the lit rooms on top of it after dusk
    let DAYIN = 0.2;
    const litMat = (m, f, peak) => {
      m.emissiveIntensity = DAYIN + f * (peak - DAYIN);
      m.color.copy(GLASS_OFF).lerp(GLASS_ON, f);
      m.metalness = 0; m.roughness = 0.04;
    };
    const ghostMat = new THREE.ShaderMaterial({
      uniforms: { color: { value: new THREE.Color(0xebe4d8) }, base: { value: 0.04 }, rim: { value: 0.34 }, op: { value: 0 } },
      vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'uniform vec3 color; uniform float base; uniform float rim; uniform float op; varying vec3 vN; varying vec3 vV; void main(){ float f = 1.0 - abs(dot(normalize(vN), normalize(vV))); gl_FragColor = vec4(color, (base + rim * f * f) * op); }',
      transparent: true, depthWrite: false
    });
    const BUILD = ['f0', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'roof'];
    // ghost = fresnel x-ray copy of the building; crossfaded with the solid meshes
    let ghostOn = false, ghostK = 0, ghostTgt = 0, ghostBuilt = false;
    const GHOST = {};
    const fadeMats = new Map();
    const GHOST_MK = { plaster: 1, stone: 1, brick: 1, slab: 1, context: 1 };
    const ALLG = BUILD.concat(['site']);
    let GHL = BUILD;
    const buildGhost = () => {
      ghostBuilt = true;
      GHL.forEach((k) => {
        if (GHOST[k]) return;
        const g = new THREE.Group();
        g.visible = false;
        scene.add(g);
        GHOST[k] = g;
        GROUPS[k].children.slice().forEach((m) => {
          if (GHOST_MK[m.userData.mk]) { const gm = new THREE.Mesh(m.geometry, ghostMat); gm.renderOrder = 1; g.add(gm); }
          m.userData.mat = m.material;
          if (!fadeMats.has(m.material)) { const fm = m.material.clone(); fm.transparent = true; fadeMats.set(m.material, fm); }
        });
      });
    };
    const applyGhost = () => {
      if (!ghostBuilt) return;
      const e = ghostK * ghostK * (3 - 2 * ghostK);
      const fading = ghostK > 0 && ghostK < 1;
      ALLG.forEach((k) => {
        if (!GHOST[k]) return;
        const on = GHL.indexOf(k) >= 0;
        GROUPS[k].children.forEach((m) => {
          const orig = m.userData.mat || m.material;
          if (on && fading) { const fm = fadeMats.get(orig); fm.opacity = 1 - e; m.material = fm; }
          else m.material = orig;
          m.visible = !on || ghostK < 1;
          m.castShadow = (!on || ghostK < 0.5) && !NO_SHADOW[m.userData.mk] && !m.isLineSegments;
        });
        GHOST[k].visible = on && GROUPS[k].visible && ghostK > 0;
      });
      ghostMat.uniforms.op.value = e * (S.garage ? 1.35 : 1);
      renderer.shadowMap.needsUpdate = true;
      needs = true;
    };
    const setGhost = (on) => {
      ghostOn = on;
      ghostTgt = on ? 1 : 0;
      if (on) buildGhost();
      needs = true;
    };
    const stepGhost = (dt) => {
      if (ghostK === ghostTgt) return;
      const s = dt / 0.6;
      ghostK = ghostTgt > ghostK ? Math.min(ghostTgt, ghostK + s) : Math.max(ghostTgt, ghostK - s);
      applyGhost();
    };
    let envTimer = 0;
    const rebuildEnv = () => {
      envTimer = 0;
      const rt = pmrem.fromScene(envScene, 0.03, 0.1, 1000);
      if (envRT) envRT.dispose();
      envRT = rt;
      scene.environment = rt.texture;
      needs = true;
    };
    const setSun = (az, el, now) => {
      SUN.az = az; SUN.el = el;
      const a = sm(-9, -2, el), b = sm(1, 16, el);
      skyU.zen.value.copy(blend('zen', a, b)); skyU.hor.value.copy(blend('hor', a, b)); skyU.gnd.value.copy(blend('gnd', a, b));
      skyU.cLit.value.copy(blend('cl', a, b)).multiplyScalar(1 + 0.35 * b); skyU.cDark.value.copy(blend('cd', a, b));
      skyU.stars.value = 1 - a;
      skyU.sunDir.value.copy(sunVec(az, el));
      gndU.near.value.copy(blend('gn', a, b)); scene.fog.color.copy(skyU.hor.value).lerp(skyU.gnd.value, 0.25); gndU.far.value.copy(skyU.hor.value).lerp(skyU.gnd.value, 0.35);
      hemi.color.copy(blend('hs', a, b)); hemi.groundColor.copy(blend('hg', a, b));
      const hi = PAL.night.hi + (PAL.dusk.hi - PAL.night.hi) * a;
      hemi.intensity = hi + (PAL.day.hi - hi) * b;
      sbMat.color.copy(blend('sb', a, b));
      rim.color.copy(blend('rc', a, b));
      rim.intensity = 0.75 - 0.4 * b;
      rim.position.set(140, 80, -120);
      const tgt = sun.target.position;
      if (el > -1.5) {
        sun.position.copy(tgt).addScaledVector(sunVec(az, Math.max(el, 2)), 260);
        sun.intensity = (2.0 + 1.6 * b) * sm(-1.5, 9, el);
        sun.color.copy(col('#ff9150').lerp(col('#ffd9b0'), sm(0, 10, el)).lerp(col('#fff6ec'), sm(10, 35, el)));
      } else {
        sun.position.copy(tgt).addScaledVector(sunVec(orientDeg - 25, 38), 260);
        sun.intensity = 0.32 * sm(-1.5, -8, el);
        sun.color.set('#9fb3d6');
      }
      skyU.sunCol.value.copy(sun.color); skyU.sunAmt.value = sm(-5, 1, el) * (1.4 - 0.5 * b);
      const fA = sm(11, 5, el), fB = sm(6, 1, el), fC = sm(2, -3, el), fD = sm(5, 0, el);
      DAYIN = 0.025 + 0.2 * b; MAT.glass.emissiveIntensity = DAYIN;
      litMat(MAT.glassLit, fA, 1.05); litMat(MAT.glassLitB, fB, 1.0); litMat(MAT.glassLitC, fC, 0.95); litMat(MAT.glassDim, fD, 0.36);
      MAT.light.emissiveIntensity = 0.1 + 0.85 * fB;
      MAT.water.emissiveIntensity = 0.55 * fB;
      renderer.toneMappingExposure = 1.0;
      const envK = 1 - 0.68 * b;
      Object.keys(MAT).forEach((k) => { MAT[k].envMapIntensity = /glass|Glass/.test(k) ? 1.6 : /^car/.test(k) ? 1.15 : envK; });
      ghostMat.uniforms.color.value.copy(col('#ebe4d8').lerp(col('#5c564e'), b));
      ghostMat.uniforms.base.value = 0.012 + 0.02 * b;
      ghostMat.uniforms.rim.value = 0.15 + 0.12 * b;
      tintSunViz(b); placeSunViz();
      const golden = sm(-3, 2, el) * (1 - sm(7, 20, el));
      setPostParams({
        bloom: 0.12 + 0.5 * (1 - b) + 0.12 * (1 - a), thr: 1.25 - 0.35 * (1 - b), ao: 0.92, aoI: 1.45,
        vig: 0.2 + 0.16 * (1 - b) + 0.06 * (1 - a), grain: 0.008 + 0.006 * (1 - b), sat: 1.03 + 0.03 * (1 - b), con: 1.09 - 0.02 * (1 - b),
        tint: [1 + 0.03 * golden - 0.02 * (1 - a), 1 - 0.005 * golden - 0.005 * (1 - a), 1 - 0.04 * golden + 0.03 * (1 - a)]
      });
      renderer.shadowMap.needsUpdate = true;
      if (now) { if (envTimer) clearTimeout(envTimer); rebuildEnv(); }
      else if (!envTimer) envTimer = setTimeout(rebuildEnv, 160);
      needs = true;
    };
    // sun glides toward its target so light, shadows and windows change gradually
    const SUNT = { az: SUN.az, el: SUN.el };
    let sunAnim = false;
    const aimSun = (az, el, now) => {
      SUNT.az = az; SUNT.el = el;
      if (now) { sunAnim = false; setSun(az, el, true); } else sunAnim = true;
    };
    const stepSun = (dt) => {
      if (!sunAnim) return;
      const daz = ((SUNT.az - SUN.az) % 360 + 540) % 360 - 180, del = SUNT.el - SUN.el;
      if (Math.abs(daz) < 0.04 && Math.abs(del) < 0.04) { sunAnim = false; setSun(SUNT.az, SUNT.el, false); return; }
      const k = 1 - Math.exp(-dt * 4.2);
      setSun((SUN.az + daz * k + 360) % 360, SUN.el + del * k, false);
    };

    // ------------------------------------------------- units (click volumes + overlays)
    const SEGCUT = [-25.9, -8.3, 9.1, 26.5];
    const unitBoxes = (sp) => {
      const f = sp.f, yb = LV[f] + 0.06, yt = LV[f + 1] + 0.04;
      const out = [];
      let a = sp.x0, pieces = [];
      SEGCUT.filter((c) => c > sp.x0 + 1e-6 && c < sp.x1 - 1e-6).concat([sp.x1]).forEach((c) => { pieces.push([a, c]); a = c; });
      pieces.forEach((p, i) => {
        let x0 = p[0] + (i === 0 ? 0.06 : 0), x1 = p[1] - (i === pieces.length - 1 ? 0.06 : 0);
        if (p[0] <= X0 + 1e-6) x0 = X0 - 0.14;
        if (p[1] >= X1 - 1e-6) x1 = X1 + 0.14;
        const fz = (f <= 1 ? ZF : frontZ(f, segAt((p[0] + p[1]) / 2))) + 0.12;
        let z0, z1;
        if (sp.row === 'g') { z0 = ZB - 0.12; z1 = -0.6; }
        else if (sp.row === 's') { z0 = 0.6; z1 = fz; }
        else { z0 = ZB - 0.12; z1 = fz; }
        const prev = out.length ? out[out.length - 1] : null;
        if (prev && Math.abs(prev[4] - z0) < 1e-6 && Math.abs(prev[5] - z1) < 1e-6 && Math.abs(prev[1] - x0) < 1e-6 && prev[3] === yt) prev[1] = x1;
        else out.push([x0, x1, yb, yt, z0, z1]);
        if (f === 6) BAYS6.forEach((b) => {
          const lo = Math.max(b[0], p[0]), hi = Math.min(b[1], p[1]);
          if (hi - lo > 0.2) out.push([lo - 0.08, hi + 0.08, yb, LV[7] - 0.2, fz - 0.12, 5.12]);
        });
      });
      return out;
    };
    const mergePos = (geos) => {
      let n = 0; geos.forEach((g) => { n += g.attributes.position.count; });
      const arr = new Float32Array(n * 3); let o = 0;
      geos.forEach((g) => { arr.set(g.attributes.position.array, o * 3); o += g.attributes.position.count; g.dispose(); });
      const out = new THREE.BufferGeometry();
      out.setAttribute('position', new THREE.BufferAttribute(arr, 3));
      return out;
    };
    const U = {};
    const hitList = [];
    // unit footprint prism from the keyplan polygon (model coordinates, x/z pairs)
    const unitPrism = (sp) => {
      const pts = [];
      for (let i = 0; i < sp.poly.length; i += 2) pts.push(new THREE.Vector2(sp.poly[i], -sp.poly[i + 1]));
      const y0 = LV[sp.f] + 0.05, y1 = (sp.f === 6 ? LV[7] - 0.22 : LV[sp.f + 1] - 0.05);
      const g = new THREE.ExtrudeGeometry(new THREE.Shape(pts), { depth: y1 - y0, bevelEnabled: false });
      g.rotateX(-Math.PI / 2); g.translate(0, y0, 0);
      return g;
    };
    (specs || []).forEach((sp) => {
      const bx = sp.poly ? [] : unitBoxes(sp);
      const mk = (b) => { const g = new THREE.BoxGeometry(b[1] - b[0], b[3] - b[2], b[5] - b[4]); g.translate((b[0] + b[1]) / 2, (b[2] + b[3]) / 2, (b[4] + b[5]) / 2); return g; };
      let geo, eg;
      if (sp.poly) {
        const g0 = unitPrism(sp);
        eg = new THREE.EdgesGeometry(g0, 25);
        geo = g0.index ? g0.toNonIndexed() : g0;
        if (!geo.attributes.uv) geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(geo.attributes.position.count * 2), 2));
        geo = merge([geo]);
      } else {
        geo = merge(bx.map(mk));
        eg = mergePos(bx.map((b) => { const g0 = mk(b); const e = new THREE.EdgesGeometry(g0); g0.dispose(); return e; }));
      }
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData.code = sp.code;
      mesh.renderOrder = 2;
      mesh.visible = false;
      const lines = new THREE.LineSegments(eg, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }));
      lines.renderOrder = 3;
      lines.visible = false;
      scene.add(mesh); scene.add(lines);
      const b0 = bx[0];
      U[sp.code] = { sp: sp, mesh: mesh, lines: lines, active: true, top: sp.c ? [sp.c[0], LV[sp.f + 1], sp.c[1]] : [(sp.x0 + sp.x1) / 2, LV[sp.f + 1], (b0[4] + b0[5]) / 2] };
      hitList.push(mesh);
    });
    // blockers: cores, ground-floor commons, roof
    const blockMat = new THREE.MeshBasicMaterial({ visible: false });
    const blockers = [];
    const addBlock = (f, x0, x1, y0, y1, z0, z1) => {
      const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0);
      g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
      const m = new THREE.Mesh(g, blockMat);
      m.userData.block = f;
      scene.add(m);
      blockers.push(m);
    };
    for (let f = 1; f <= 6; f++) [[-19.8, -14.0], [-2.4, 3.4], [14.9, 20.4]].forEach((c) => addBlock(f, c[0], c[1], LV[f] + 0.06, LV[f + 1] - 0.06, -4.3, 0.3));
    addBlock(0, -8.4, X1 + 0.1, 0, LV[1], 0.6, ZF + 0.2);
    addBlock(0, -20.1, X1 + 0.1, 0, LV[1], ZB - 0.2, -0.6);
    addBlock(7, X0 - 0.3, X1 + 0.3, LV[7], ROOF + 0.2, ZB - 0.3, 5.6);

    // ------------------------------------------------- labels (sprites)
    const pillTex = (text, bg, fg) => {
      const c = document.createElement('canvas');
      const g = c.getContext('2d');
      const fs = 44;
      g.font = '600 ' + fs + 'px "Instrument Sans", "Helvetica Neue", Arial, sans-serif';
      const tw = Math.ceil(g.measureText(text).width);
      c.width = tw + 48; c.height = 76;
      g.font = '600 ' + fs + 'px "Instrument Sans", "Helvetica Neue", Arial, sans-serif';
      g.fillStyle = bg;
      const r = 38;
      g.beginPath();
      g.moveTo(r, 0); g.lineTo(c.width - r, 0); g.arc(c.width - r, r, r, -Math.PI / 2, Math.PI / 2); g.lineTo(r, c.height); g.arc(r, r, r, Math.PI / 2, Math.PI * 1.5); g.closePath();
      g.fill();
      g.fillStyle = fg;
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(text, c.width / 2, c.height / 2 + 2);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return { t: t, a: c.width / c.height };
    };
    let vh = 600;
    const spriteScale = (sp, px) => {
      const s = px * 2 * Math.tan((camera.fov * Math.PI / 180) / 2) / vh;
      sp.scale.set(s * sp.userData.a, s, 1);
    };
    const gLabels = [['−1  ·  −3,12 m', -12.0, -3.12 + 2.4, -9.0], ['−2  ·  −5,98 m', 9.0, -5.98 + 2.3, -9.0]].map((d) => {
      const p = pillTex(d[0], '#FBF8F2', '#4B2A1D');
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: p.t, depthTest: false, depthWrite: false, sizeAttenuation: false, transparent: true, toneMapped: false }));
      sp.userData.a = p.a; sp.center.set(0.5, 0.5); sp.renderOrder = 14; sp.layers.set(2); sp.position.set(d[1], d[2], d[3]);
      GROUPS.garage.add(sp);
      return sp;
    });
    const pin = new THREE.Sprite(new THREE.SpriteMaterial({ depthTest: false, depthWrite: false, sizeAttenuation: false, transparent: true, toneMapped: false }));
    pin.layers.set(2);
    pin.center.set(0.5, 0);
    pin.renderOrder = 20;
    pin.visible = false;
    pin.userData.a = 2;
    scene.add(pin);
    const pinGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 1, 0)]);
    const pinLine = new THREE.Line(pinGeo, new THREE.LineBasicMaterial({ color: 0xe08455, depthTest: false, transparent: true, toneMapped: false }));
    pinLine.layers.set(2);
    pinLine.renderOrder = 19;
    pinLine.visible = false;
    scene.add(pinLine);
    let pinCode = '';
    const labels = [];
    const labelCache = {};

    // ------------------------------------------------- state + appearance
    const S = { mode: 'facade', sel: null, iso: null, status: {}, active: null, filtering: false, focus: false };
    let hover = null;
    const COL = { disp: 0xd4b571, res: 0x8fa7c0, vend: 0x8a857c };
    const applyUnits = () => {
      Object.keys(U).forEach((code) => {
        const u = U[code], f = u.sp.f, st = S.status[code] || 'disp';
        const hiddenFloor = S.iso !== null && f > S.iso;
        const pass = !S.active || S.active.has(code);
        u.active = !hiddenFloor && (pass || code === S.sel);
        let col = 0xffffff, op = 0, eop = 0, ecol = 0xffffff;
        if (ghostOn) {
          u.active = true;
          const sf = S.sel && U[S.sel] ? U[S.sel].sp.f : -1;
          if (code === S.sel) { col = 0xd46b3d; op = 0.92; eop = 1; ecol = 0xffd2b5; }
          else if (code === hover) { col = 0xfff6e8; op = 0.22; eop = 0.9; }
          else if (f === sf) { col = 0xffffff; op = 0.05; eop = 0.32; ecol = 0xe9e2d6; }
        } else if (u.active) {
          if (code === S.sel) { col = 0xd46b3d; op = 0.6; eop = 1; ecol = 0xffc09a; }
          else if (code === hover) { col = 0xfff6e8; op = 0.2; eop = 0.95; }
          else if (S.iso !== null && f === S.iso) { col = COL[st]; op = 0.86; eop = 0.55; ecol = 0x2a2520; }
          else if (S.mode === 'status' || S.filtering) { col = COL[st]; op = S.mode === 'status' ? 0.5 : 0.55; eop = 0.4; ecol = col; }
        }
        if (S.garage) { op = 0; eop = 0; }
        u.mesh.material.color.setHex(col);
        u.mesh.material.opacity = op;
        u.mesh.visible = op > 0;
        u.lines.material.color.setHex(ecol);
        u.lines.material.opacity = eop;
        u.lines.visible = eop > 0;
      });
    };
    const updatePin = () => {
      const u = S.sel ? U[S.sel] : null;
      if (!u || S.garage || (S.iso !== null && u.sp.f > S.iso)) { pin.visible = false; pinLine.visible = false; return; }
      if (pinCode !== S.sel) {
        const p = pillTex(S.sel, '#d46b3d', '#1a120d');
        if (pin.material.map) pin.material.map.dispose();
        pin.material.map = p.t; pin.material.needsUpdate = true;
        pin.userData.a = p.a;
        pinCode = S.sel;
      }
      const top = u.top;
      const yPin = (S.iso !== null || ghostOn) ? top[1] + 3.4 : Math.max(top[1] + 3.2, ROOF + 3.4);
      pin.position.set(top[0], yPin, top[2]);
      pinLine.position.set(top[0], top[1], top[2]);
      pinLine.scale.set(1, yPin - top[1], 1);
      pin.visible = true; pinLine.visible = true;
      spriteScale(pin, 30);
    };
    const HS = {
      rooftop: { p: [9.1, ROOF + 2.0, -2.1], n: null, view: { az: Math.PI - 0.45, el: 0.62, r: 58, tx: 6, ty: ROOF, tz: -2 } },
      garden: { p: [7.4, 5.6, -10.4], n: [0, 0, -1], view: { az: Math.PI - 0.35, el: 0.42, r: 52, tx: 0, ty: 4, tz: -10 } },
      work: { p: [-13.2, 2.5, -6.9], n: [0, 0, -1], view: { az: Math.PI + 0.25, el: 0.22, r: 40, tx: -9, ty: 4, tz: -8 } },
      lobby: { p: [0, 4.7, ZF + 0.6], n: [0, 0, 1], view: { az: 0.12, el: 0.1, r: 42, tx: 0, ty: 5, tz: 6 } },
      dining: { p: [-28.6, 5.3, ZF + 0.6], n: [0, 0, 1], view: { az: -0.35, el: 0.1, r: 44, tx: -22, ty: 5.5, tz: 6 } },
      lounge: { p: [-14.8, 4.0, ZF + 0.6], n: [0, 0, 1], view: { az: -0.15, el: 0.1, r: 44, tx: -15, ty: 5.5, tz: 6 } },
      gym: { p: [13.2, 4.7, ZF + 0.6], n: [0, 0, 1], view: { az: 0.35, el: 0.1, r: 44, tx: 13, ty: 5.5, tz: 6 } },
      garage: { p: [33.8, 3.3, ZF + 0.3], n: [0, 0, 1], view: { az: 0.38, el: 0.78, r: 96, tx: 5, ty: -4, tz: -6 } },
      real: { p: null, view: { az: 0.78, el: 0.06, r: 82, tx: 4, ty: 12.5, tz: -1 } }
    };
    const hsSprites = {};
    let hsOn = true;
    const hsTex = (text) => {
      const c = document.createElement('canvas'), g = c.getContext('2d'), fs = 40, H = 84;
      g.font = '600 ' + fs + 'px "Instrument Sans", "Helvetica Neue", Arial, sans-serif';
      const tw = text ? Math.ceil(g.measureText(text).width) : 0;
      c.width = text ? H + tw + 40 : H; c.height = H;
      g.font = '600 ' + fs + 'px "Instrument Sans", "Helvetica Neue", Arial, sans-serif';
      g.fillStyle = 'rgba(251,248,242,.95)';
      const r = H / 2 - 4;
      if (text) { g.beginPath(); g.moveTo(H / 2, 4); g.lineTo(c.width - r - 4, 4); g.arc(c.width - r - 4, H / 2, r, -Math.PI / 2, Math.PI / 2); g.lineTo(H / 2, H - 4); g.closePath(); g.fill(); g.strokeStyle = 'rgba(75,42,29,.16)'; g.lineWidth = 2; g.stroke(); }
      g.fillStyle = '#4b2a1d'; g.beginPath(); g.arc(H / 2, H / 2, H / 2 - 4, 0, 6.283); g.fill();
      g.strokeStyle = '#fbf8f2'; g.lineWidth = 4.5;
      g.beginPath(); g.ellipse(H / 2, H / 2, 17, 11, 0, 0, 6.283); g.stroke();
      g.fillStyle = '#fbf8f2'; g.beginPath(); g.arc(H / 2, H / 2, 6, 0, 6.283); g.fill();
      if (text) { g.fillStyle = '#3a2a20'; g.textBaseline = 'middle'; g.fillText(text, H + 10, H / 2 + 2); }
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
      return { t: t, a: c.width / c.height, cx: (H / 2) / c.width };
    };
    let hsList = [], hsNarrow = false;
    const setHotspots = (list) => {
      hsList = list;
      list.forEach((h) => {
        const def = HS[h.id];
        if (!def || !def.p) return;
        let sp = hsSprites[h.id];
        if (!sp) {
          sp = new THREE.Sprite(new THREE.SpriteMaterial({ depthTest: false, depthWrite: false, sizeAttenuation: false, transparent: true, toneMapped: false }));
          sp.layers.set(2); sp.renderOrder = 18; sp.position.set(def.p[0], def.p[1], def.p[2]);
          scene.add(sp); hsSprites[h.id] = sp;
        }
        const tx = hsTex(hsNarrow ? '' : h.label);
        if (sp.material.map) sp.material.map.dispose();
        sp.material.map = tx.t; sp.material.needsUpdate = true; sp.userData.a = tx.a; sp.center.set(tx.cx, 0.5);
      });
      updateHotspots();
    };
    let HSPX = 30;
    const updateHotspots = () => {
      const show = hsOn && S.iso === null && !ghostOn;
      Object.keys(hsSprites).forEach((id) => {
        const sp = hsSprites[id], def = HS[id];
        let vis = show;
        if (vis && def.n) {
          const dx = camera.position.x - def.p[0], dz = camera.position.z - def.p[2];
          vis = def.n[0] * dx + def.n[2] * dz > 4;
        }
        if (vis && !def.n) vis = cur.el > 0.12;
        sp.visible = vis;
        if (vis) spriteScale(sp, HSPX);
      });
    };
    const _hp = new THREE.Vector3();
    const pickHotspot = (cx, cy) => {
      const rc = canvas.getBoundingClientRect();
      let best = null;
      Object.keys(hsSprites).forEach((id) => {
        const sp = hsSprites[id];
        if (!sp.visible) return;
        _hp.copy(sp.position).project(camera);
        if (_hp.z > 1) return;
        const px = rc.left + (_hp.x * 0.5 + 0.5) * rc.width, py = rc.top + (-_hp.y * 0.5 + 0.5) * rc.height;
        const w = HSPX * sp.userData.a, x0 = px - sp.center.x * w;
        if (cx >= x0 && cx <= x0 + w && Math.abs(cy - py) <= HSPX / 2 + 2) best = id;
      });
      return best;
    };
    const goHotspot = (id) => {
      const v = HS[id] && HS[id].view;
      if (!v) return;
      vel = 0; CAM.az = near(v.az); CAM.el = v.el; CAM.r = v.r; CAM.tx = v.tx; CAM.ty = v.ty; CAM.tz = v.tz;
    };
    const updateLabels = () => {
      labels.forEach((l) => { l.visible = false; });
      if (S.iso === null) return;
      let i = 0;
      Object.keys(U).forEach((code) => {
        const u = U[code];
        if (u.sp.f !== S.iso || !u.active || code === S.sel) return;
        let sp = labels[i];
        if (!sp) { sp = new THREE.Sprite(new THREE.SpriteMaterial({ depthTest: false, depthWrite: false, sizeAttenuation: false, transparent: true, toneMapped: false })); sp.center.set(0.5, 0.5); sp.renderOrder = 15; sp.layers.set(2); scene.add(sp); labels[i] = sp; }
        if (sp.userData.code !== code) {
          const p = labelCache[code] || (labelCache[code] = pillTex(code, 'rgba(251,248,242,.94)', '#3a2a20'));
          sp.material.map = p.t; sp.material.needsUpdate = true; sp.userData.a = p.a; sp.userData.code = code;
        }
        sp.position.set(u.top[0], u.top[1] + 0.5, u.top[2]);
        spriteScale(sp, 22);
        sp.visible = true;
        i++;
      });
    };


    // ------------------------------------------------- sun made visible: a glowing disc at the real solar position
    const SV = { R: 600, y: -3.38, cx: 0, cz: -1 };
    const sunViz = new THREE.Group();
    sunViz.name = 'sunViz';
    scene.add(sunViz);
    const svPoint = (az, el, r) => { const v = sunVec(az, el); return new THREE.Vector3(SV.cx + v.x * r, SV.y + v.y * r, SV.cz + v.z * r); };
    const sunTex = tex(128, 128, (g, w, h) => {
      g.clearRect(0, 0, w, h);
      const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.2, 'rgba(255,246,222,1)'); gr.addColorStop(0.27, 'rgba(255,214,150,.7)');
      gr.addColorStop(0.5, 'rgba(255,176,96,.22)'); gr.addColorStop(1, 'rgba(255,150,70,0)');
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
    });
    sunTex.wrapS = sunTex.wrapT = THREE.ClampToEdgeWrapping;
    const sunDisc = new THREE.Sprite(new THREE.SpriteMaterial({ map: sunTex, transparent: true, depthWrite: false, color: new THREE.Color(3.4, 2.8, 2.1) }));
    sunDisc.scale.set(62, 62, 1);
    sunDisc.renderOrder = 3;
    sunViz.add(sunDisc);
    const placeSunViz = () => {
      sunDisc.position.copy(svPoint(SUN.az, Math.max(SUN.el, 0), SV.R));
      sunDisc.visible = SUN.el > -0.8;
    };
    const tintSunViz = (b) => { sunDisc.material.color.setRGB(3.4 + 1.4 * b, 2.8 + 1.2 * b, 2.1 + 0.6 * b); };

    // ------------------------------------------------- post-processing: SAO, bloom, colour grade (hand-built, core three only)
    let post = null;
    const fsScene = new THREE.Scene();
    const fsCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const fsQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    fsQuad.frustumCulled = false;
    fsScene.add(fsQuad);
    const FSV = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';
    // post passes sample with an explicit LOD: no implicit-derivative (gradient) fetches inside loops,
    // which Direct3D/ANGLE flags with warning X3595 (SAO loop after an early return)
    const TXDEF = '#if __VERSION__ >= 300\n#define TX(t, u) textureLod(t, u, 0.0)\n#else\n#define TX(t, u) texture2D(t, u)\n#endif\n';
    const fsMat = (frag, uniforms) => new THREE.ShaderMaterial({ vertexShader: FSV, fragmentShader: TXDEF + frag.replace(/texture2D\(/g, 'TX('), uniforms: uniforms, depthTest: false, depthWrite: false });
    const pass = (mat, target) => { fsQuad.material = mat; renderer.setRenderTarget(target); renderer.render(fsScene, fsCam); };
    try {
      const gl2 = renderer.capabilities.isWebGL2;
      const ex = renderer.extensions;
      const half = gl2 ? (ex.has('EXT_color_buffer_float') || ex.has('EXT_color_buffer_half_float')) : (ex.has('EXT_color_buffer_half_float') && ex.has('OES_texture_half_float_linear'));
      const HDR = half ? THREE.HalfFloatType : THREE.UnsignedByteType;
      const rt = (o) => new THREE.WebGLRenderTarget(4, 4, Object.assign({ type: HDR, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false }, o || {}));
      const Pp = {};
      Pp.scene = rt({ depthBuffer: true, samples: gl2 ? (MOBILE ? 4 : 8) : 0 });
      Pp.nrm = new THREE.WebGLRenderTarget(4, 4, { type: THREE.UnsignedByteType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, depthBuffer: true });
      Pp.nrm.depthTexture = new THREE.DepthTexture(4, 4);
      Pp.nrm.depthTexture.type = THREE.UnsignedIntType;
      Pp.ao = rt({ type: THREE.UnsignedByteType });
      Pp.ao2 = rt({ type: THREE.UnsignedByteType });
      Pp.down = [rt(), rt(), rt(), rt()];
      Pp.up = [rt(), rt(), rt()];
      Pp.normalMat = new THREE.MeshNormalMaterial();
      Pp.pre = fsMat(
        'uniform sampler2D tSrc; uniform vec2 px; uniform float thr; uniform float knee; varying vec2 vUv;' +
        'vec3 s(vec2 o){ return texture2D(tSrc, vUv + o * px).rgb; }' +
        'void main(){ vec3 c = (s(vec2(-0.5,-0.5)) + s(vec2(0.5,-0.5)) + s(vec2(-0.5,0.5)) + s(vec2(0.5,0.5))) * 0.25;' +
        'float l = max(c.r, max(c.g, c.b)); float sk = clamp(l - thr + knee, 0.0, 2.0 * knee); sk = sk * sk / (4.0 * knee + 1e-4);' +
        'float w = max(sk, l - thr) / max(l, 1e-4); gl_FragColor = vec4(min(c * w, vec3(16.0)), 1.0); }',
        { tSrc: { value: null }, px: { value: new THREE.Vector2() }, thr: { value: 0.9 }, knee: { value: 0.35 } });
      Pp.dn = fsMat(
        'uniform sampler2D tSrc; uniform vec2 px; varying vec2 vUv;' +
        'void main(){ vec3 c = texture2D(tSrc, vUv).rgb * 4.0;' +
        'c += texture2D(tSrc, vUv + vec2(-1.0,-1.0) * px).rgb + texture2D(tSrc, vUv + vec2(1.0,-1.0) * px).rgb + texture2D(tSrc, vUv + vec2(-1.0,1.0) * px).rgb + texture2D(tSrc, vUv + vec2(1.0,1.0) * px).rgb;' +
        'gl_FragColor = vec4(c / 8.0, 1.0); }',
        { tSrc: { value: null }, px: { value: new THREE.Vector2() } });
      Pp.upm = fsMat(
        'uniform sampler2D tLow; uniform sampler2D tHigh; uniform vec2 px; varying vec2 vUv;' +
        'void main(){ vec2 d = px; vec3 c = texture2D(tLow, vUv).rgb * 4.0;' +
        'c += (texture2D(tLow, vUv + vec2(-d.x, 0.0)).rgb + texture2D(tLow, vUv + vec2(d.x, 0.0)).rgb + texture2D(tLow, vUv + vec2(0.0, -d.y)).rgb + texture2D(tLow, vUv + vec2(0.0, d.y)).rgb) * 2.0;' +
        'c += texture2D(tLow, vUv + d).rgb + texture2D(tLow, vUv - d).rgb + texture2D(tLow, vUv + vec2(d.x, -d.y)).rgb + texture2D(tLow, vUv + vec2(-d.x, d.y)).rgb;' +
        'gl_FragColor = vec4(c / 16.0 + texture2D(tHigh, vUv).rgb, 1.0); }',
        { tLow: { value: null }, tHigh: { value: null }, px: { value: new THREE.Vector2() } });
      Pp.sao = fsMat(
        'uniform sampler2D tDepth; uniform sampler2D tNormal; uniform mat4 projInv; uniform float projY; uniform float aspInv; uniform float radius; uniform float intensity; varying vec2 vUv;' +
        'vec3 vpos(vec2 uv){ float d = texture2D(tDepth, uv).x; vec4 p = projInv * vec4(uv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0); return p.xyz / p.w; }' +
        'float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }' +
        'void main(){ float d = texture2D(tDepth, vUv).x; if (d >= 0.99999) { gl_FragColor = vec4(1.0); return; }' +
        'vec3 P = vpos(vUv); vec3 N = normalize(texture2D(tNormal, vUv).xyz * 2.0 - 1.0);' +
        'float sr = radius * projY * 0.5 / max(-P.z, 0.5); float a0 = hash(gl_FragCoord.xy) * 6.2831853; float r2 = radius * radius; float sum = 0.0;' +
        'for (int i = 0; i < 14; i++) { float t = (float(i) + 0.5) / 14.0; float a = a0 + t * 16.336; vec2 off = vec2(cos(a) * aspInv, sin(a)) * sr * t;' +
        'vec3 v = vpos(vUv + off) - P; float vv = dot(v, v); float vn = dot(v, N); float f = max(r2 - vv, 0.0); sum += f * f * f * max((vn - 0.06 * (-P.z) * 0.01 - 0.03) / (0.03 + vv), 0.0); }' +
        'float ao = max(0.0, 1.0 - sum * intensity / (r2 * r2 * r2) * (5.0 / 14.0)); gl_FragColor = vec4(vec3(ao), 1.0); }',
        { tDepth: { value: null }, tNormal: { value: null }, projInv: { value: new THREE.Matrix4() }, projY: { value: 1 }, aspInv: { value: 1 }, radius: { value: 1.8 }, intensity: { value: 1.0 } });
      Pp.blur = fsMat(
        'uniform sampler2D tAO; uniform sampler2D tDepth; uniform vec2 px; uniform float cn; uniform float cf; varying vec2 vUv;' +
        'float lin(float d){ float z = d * 2.0 - 1.0; return 2.0 * cn * cf / (cf + cn - z * (cf - cn)); }' +
        'void main(){ float dc = lin(texture2D(tDepth, vUv).x); float s = 0.0; float w = 0.0;' +
        'for (int x = -2; x <= 2; x++) { for (int y = -2; y <= 2; y++) { vec2 uv = vUv + vec2(float(x), float(y)) * px;' +
        'float dz = abs(lin(texture2D(tDepth, uv).x) - dc); float ww = 1.0 / (1.0 + dz * dz * 6.0); s += texture2D(tAO, uv).r * ww; w += ww; } }' +
        'gl_FragColor = vec4(vec3(s / w), 1.0); }',
        { tAO: { value: null }, tDepth: { value: null }, px: { value: new THREE.Vector2() }, cn: { value: camera.near }, cf: { value: camera.far } });
      Pp.comp = new THREE.ShaderMaterial({
        vertexShader: FSV, depthTest: false, depthWrite: false,
        uniforms: { tScene: { value: null }, tBloom: { value: null }, tAO: { value: null }, bloomK: { value: 0.6 }, aoK: { value: 0.8 }, useAO: { value: 1 }, vig: { value: 0.3 }, grain: { value: 0.02 }, sat: { value: 1.04 }, con: { value: 1.06 }, tint: { value: new THREE.Vector3(1, 1, 1) }, seed: { value: 0 } },
        fragmentShader:
          'uniform sampler2D tScene; uniform sampler2D tBloom; uniform sampler2D tAO; uniform float bloomK; uniform float aoK; uniform float useAO; uniform float vig; uniform float grain; uniform float sat; uniform float con; uniform vec3 tint; uniform float seed; varying vec2 vUv;' +
          'float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)) + seed) * 43758.5453); }' +
          'void main(){ vec3 c = texture2D(tScene, vUv).rgb; float ao = mix(1.0, texture2D(tAO, vUv).r, aoK * useAO); c *= ao;' +
          'c += texture2D(tBloom, vUv).rgb * bloomK; c *= tint;\n#ifdef TONE_MAPPING\nc = toneMapping(c);\n#endif\n' +
          'float l = dot(c, vec3(0.2126, 0.7152, 0.0722)); c = mix(vec3(l), c, sat); c = clamp(pow(max(c, vec3(0.0)) / 0.18, vec3(con)) * 0.18, 0.0, 1.0);' +   // contrast around mid-grey that keeps shadow detail (no black clip)
          'vec2 q = vUv - 0.5; c *= clamp(1.0 - vig * dot(q, q) * 2.2, 0.0, 1.0); c += (hash(gl_FragCoord.xy) - 0.5) * grain * (0.25 + dot(c, vec3(0.3333)));' +
          'gl_FragColor = linearToOutputTexel(vec4(c, 1.0)); }'
      });
      Pp.useAO = true;
      Pp.size = [4, 4];
      post = Pp;
    } catch (err) { post = null; }

    const prepassHide = () => {
      const list = [sky, ground, shadowPlane, ctxEdges, sunViz].concat(railMeshes, blockers);
      Object.keys(U).forEach((c) => { list.push(U[c].mesh, U[c].lines); });
      if (ghostK >= 0.5) GHL.forEach((k) => list.push(GROUPS[k]));
      ALLG.forEach((k) => { if (GHOST[k]) list.push(GHOST[k]); });
      if (FADE.ctxN.op < 0.6) list.push(GROUPS.ctxN);
      if (FADE.ctxS.op < 0.6) list.push(GROUPS.ctxS);
      return list;
    };
    let frame = 0, drawMoving = false, wasMoving = false;
    const postResize = (w, h) => {
      if (!post) return;
      const dpr = renderer.getPixelRatio();
      const fw = Math.max(4, Math.round(w * dpr)), fh = Math.max(4, Math.round(h * dpr));
      const hw = Math.max(2, Math.round(fw / 2)), hh = Math.max(2, Math.round(fh / 2));
      post.size = [fw, fh];
      post.scene.setSize(fw, fh);
      post.nrm.setSize(hw, hh);
      post.ao.setSize(hw, hh);
      post.ao2.setSize(hw, hh);
      for (let i = 0; i < 4; i++) {
        const dw = Math.max(2, Math.round(fw / Math.pow(2, i + 1))), dh = Math.max(2, Math.round(fh / Math.pow(2, i + 1)));
        post.down[i].setSize(dw, dh);
        if (i < 3) post.up[i].setSize(dw, dh);
      }
      post.useAO = true;   // phones too: ambient occlusion is computed on the settled frames (see draw)
    };
    const draw = () => {
      frame++;
      if (!post) {
        camera.layers.enable(2);
        renderer.setRenderTarget(null);
        renderer.render(scene, camera);
        camera.layers.disable(2);
        return;
      }
      const Pp = post;
      // phones skip the AO prepass while the camera moves and get it back on the frame the camera settles
      const aoNow = Pp.useAO && !(MOBILE && drawMoving);
      if (aoNow) {
        const hid = prepassHide();
        const vis = hid.map((o) => o.visible);
        hid.forEach((o) => { o.visible = false; });
        scene.overrideMaterial = Pp.normalMat;
        renderer.setRenderTarget(Pp.nrm);
        renderer.render(scene, camera);
        scene.overrideMaterial = null;
        hid.forEach((o, i) => { o.visible = vis[i]; });
        const su = Pp.sao.uniforms;
        su.tDepth.value = Pp.nrm.depthTexture; su.tNormal.value = Pp.nrm.texture;
        su.projInv.value.copy(camera.projectionMatrixInverse); su.projY.value = camera.projectionMatrix.elements[5];
        su.aspInv.value = Pp.size[1] / Pp.size[0];
        pass(Pp.sao, Pp.ao);
        const bu = Pp.blur.uniforms;
        bu.tAO.value = Pp.ao.texture; bu.tDepth.value = Pp.nrm.depthTexture; bu.px.value.set(1 / Pp.ao.width, 1 / Pp.ao.height);
        pass(Pp.blur, Pp.ao2);
      }
      renderer.setRenderTarget(Pp.scene);
      renderer.render(scene, camera);
      const pu = Pp.pre.uniforms;
      pu.tSrc.value = Pp.scene.texture; pu.px.value.set(1 / Pp.size[0], 1 / Pp.size[1]);
      pass(Pp.pre, Pp.down[0]);
      for (let i = 1; i < 4; i++) {
        const du = Pp.dn.uniforms;
        du.tSrc.value = Pp.down[i - 1].texture; du.px.value.set(1 / Pp.down[i - 1].width, 1 / Pp.down[i - 1].height);
        pass(Pp.dn, Pp.down[i]);
      }
      const upPass = (low, high, target) => {
        const uu = Pp.upm.uniforms;
        uu.tLow.value = low.texture; uu.tHigh.value = high.texture; uu.px.value.set(1 / low.width, 1 / low.height);
        pass(Pp.upm, target);
      };
      upPass(Pp.down[3], Pp.down[2], Pp.up[2]);
      upPass(Pp.up[2], Pp.down[1], Pp.up[1]);
      upPass(Pp.up[1], Pp.down[0], Pp.up[0]);
      const cu = Pp.comp.uniforms;
      cu.tScene.value = Pp.scene.texture; cu.tBloom.value = Pp.up[0].texture; cu.tAO.value = Pp.ao2.texture;
      cu.useAO.value = aoNow ? 1 : 0; cu.seed.value = (frame % 61) * 0.37;
      pass(Pp.comp, null);
      camera.layers.set(2);
      renderer.autoClear = false;
      renderer.render(scene, camera);
      renderer.autoClear = true;
      camera.layers.set(0);
    };
    const setPostParams = (m) => {
      if (!post) return;
      const cu = post.comp.uniforms;
      cu.bloomK.value = m.bloom; cu.aoK.value = m.ao; cu.vig.value = m.vig; cu.grain.value = m.grain; cu.sat.value = m.sat; cu.con.value = m.con;
      cu.tint.value.set(m.tint[0], m.tint[1], m.tint[2]);
      post.pre.uniforms.thr.value = m.thr;
      post.sao.uniforms.intensity.value = m.aoI;
    };

    // ------------------------------------------------- camera control
    const TAU = Math.PI * 2;
    const CAM = { az: 0.6, el: 0.1, r: 97, tx: -2, ty: 12.5, tz: -1 };
    const cur = Object.assign({}, CAM, { az: 1.35, el: 0.62, r: 200 });
    let vel = 0, dragging = false, needs = true, raf = 0, alive = true;
    // frame-time governor: average the moving frames in windows of 30; above 26 ms, drop one resolution step (never back up)
    let gT = 0, gAcc = 0, gN = 0;
    const govern = (t) => {
      if (gT) { gAcc += Math.min(100, t - gT); gN++; } gT = t;
      if (gN < 30) return;
      const avg = gAcc / gN; gAcc = 0; gN = 0;
      if (avg > 26 && dprIdx < DPR_STEPS.length - 1) { dprIdx++; renderer.setPixelRatio(dprNow()); resize(); }
    };
    const near = (t) => t + TAU * Math.round((CAM.az - t) / TAU);
    const VIEWS = {
      rua: { az: 0.6, el: 0.1, r: 97, ty: 12.5, tx: -2 },
      jardim: { az: Math.PI - 0.5, el: 0.33, r: 100, ty: 9 },
      aerea: { az: 0.35, el: 0.86, r: 136, ty: 12 },
      sol: { az: 0.55, el: 0.5, r: 235, ty: 24, tx: -10 },
      garagem: { az: 0.38, el: 0.78, r: 96, tx: 5, ty: -4, tz: -6 }
    };
    const fitK = () => Math.max(1, 1.15 / Math.max(0.3, camera.aspect));
    const FADE = {
      ctxN: { op: 1, k: () => sm(-0.1, -0.55, Math.cos(cur.az)) * (1 - sm(0.8, 1.2, cur.el)) },
      ctxS: { op: 1, k: () => sm(0.05, 0.4, Math.cos(cur.az)) * (1 - sm(0.72, 0.86, cur.el)) }
    };
    const updCtxN = () => {
      Object.keys(FADE).forEach((gk) => {
        const F = FADE[gk];
        let op = 1 - F.k();
        if (op > 0.985) op = 1; if (op < 0.015) op = 0;
        if (Math.abs(op - F.op) < 0.01 && !((op === 1 || op === 0) && F.op !== op)) return;
        F.op = op;
        GROUPS[gk].visible = op > 0.03 && !S.garage;
        let flip = false;
        GROUPS[gk].children.forEach((m) => {
          const mat = m.material, tr = op < 1;
          if (mat.transparent !== tr) { mat.transparent = tr; mat.needsUpdate = true; }
          mat.opacity = m.isLineSegments ? 0.75 * op : op;
          mat.depthWrite = !tr;
          const cs = !m.isLineSegments && op > 0.5 && !NO_SHADOW[m.userData.mk];
          if (m.castShadow !== cs) { m.castShadow = cs; flip = true; }
        });
        if (flip) renderer.shadowMap.needsUpdate = true;
      });
    };
    let baseE9 = 0;
    const applyCam = () => {
      const r = cur.r * fitK();
      const py = cur.ty + r * Math.sin(cur.el), dH = Math.max(1e-3, r * Math.cos(cur.el));
      camera.position.set(cur.tx + dH * Math.sin(cur.az), py, cur.tz + dH * Math.cos(cur.az));
      const k = 1 - sm(0.2, 0.55, cur.el), lookY = cur.ty + (py - cur.ty) * k;
      camera.lookAt(cur.tx, lookY, cur.tz);
      const pm = camera.projectionMatrix.elements;
      pm[9] = baseE9 - pm[5] * Math.tan(Math.atan((py - cur.ty) / dH) - Math.atan((py - lookY) / dH));
      camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
      updCtxN();
      if (GROUPS.garage.visible) gLabels.forEach((sp) => spriteScale(sp, 24));
      updateHotspots();
    };
    let last = performance.now();
    const loop = () => {
      if (!alive) return;
      raf = requestAnimationFrame(loop);
      const now = performance.now();
      const dt = Math.min(0.1, Math.max(0.001, (now - last) / 1000));
      last = now;
      const kk = 1 - Math.exp(-dt * 6.0);
      if (!dragging && Math.abs(vel) > 1e-5) { CAM.az += vel * dt * 60; vel *= Math.pow(0.92, dt * 60); }
      stepGhost(dt);
      stepSun(dt);
      let moving = false;
      ['az', 'el', 'r', 'tx', 'ty', 'tz'].forEach((k) => {
        const d = CAM[k] - cur[k];
        if (Math.abs(d) > 1e-4) { cur[k] += d * kk; moving = true; } else cur[k] = CAM[k];
      });
      if (!moving && wasMoving && MOBILE) needs = true;   // one refined frame (with AO) once the camera settles
      wasMoving = moving; drawMoving = moving;
      if (moving || needs) {
        applyCam();
        draw();
        needs = false;
        if (moving) govern(now); else gT = 0;
      }
    };

    // ------------------------------------------------- input
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const pickAt = (cx, cy) => {
      if (S.garage) return null;
      const r = canvas.getBoundingClientRect();
      ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const cands = hitList.filter((m) => U[m.userData.code].active);
      if (!ghostOn) blockers.forEach((b) => { if (S.iso === null || b.userData.block <= S.iso) cands.push(b); });
      const hits = ray.intersectObjects(cands, false);
      if (!hits.length) return null;
      return hits[0].object.userData.code || null;
    };
    const pts = new Map();
    let down = null, moved = false, pinch0 = 0, r0 = 0, lastX = 0, hovRaf = 0, hovEvt = null;
    const dist = () => { const a = Array.from(pts.values()); return Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y) || 1; };
    const setHover = (code) => {
      if (code === hover) return;
      hover = code;
      canvas.style.cursor = code ? 'pointer' : 'grab';
      applyUnits(); needs = true;
      if (hooks.onHover) hooks.onHover(code);
    };
    const onDown = (e) => {
      if (e.button !== undefined && e.button > 0) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 1) { down = { x: e.clientX, y: e.clientY, az: CAM.az, el: CAM.el }; moved = false; vel = 0; lastX = e.clientX; }
      else if (pts.size === 2) { pinch0 = dist(); r0 = CAM.r; moved = true; }
    };
    const onMove = (e) => {
      if (pts.has(e.pointerId)) pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2) { CAM.r = Math.min(300, Math.max(40, r0 * pinch0 / dist())); return; }
      if (down && pts.size === 1) {
        const dx = e.clientX - down.x, dy = e.clientY - down.y;
        if (!moved && Math.abs(dx) + Math.abs(dy) > 5) {
          moved = true; dragging = true;
          try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
          canvas.style.cursor = 'grabbing';
          setHover(null);
        }
        if (moved) {
          CAM.az = down.az - dx * 0.0055;
          CAM.el = Math.min(1.3, Math.max(0.06, down.el + dy * 0.004));
          vel = -(e.clientX - lastX) * 0.0055 * 0.5;
          lastX = e.clientX;
        }
        return;
      }
      if (e.pointerType === 'mouse') {
        hovEvt = e;
        if (!hovRaf) hovRaf = requestAnimationFrame(() => { hovRaf = 0; if (!hovEvt || dragging) return; if (pickHotspot(hovEvt.clientX, hovEvt.clientY)) { setHover(null); canvas.style.cursor = 'pointer'; } else setHover(pickAt(hovEvt.clientX, hovEvt.clientY)); });
      }
    };
    const onUp = (e) => {
      const was = pts.has(e.pointerId);
      pts.delete(e.pointerId);
      if (was && e.type === 'pointerup' && down && !moved) {
        const hs = pickHotspot(e.clientX, e.clientY);
        if (hs) { goHotspot(hs); if (hooks.onHotspot) hooks.onHotspot(hs); }
        else {
          const code = pickAt(e.clientX, e.clientY);
          if (code && hooks.onPick) hooks.onPick(code);
        }
      }
      if (pts.size === 0) { down = null; dragging = false; canvas.style.cursor = hover ? 'pointer' : 'grab'; }
    };
    const onLeave = () => { if (!dragging) setHover(null); };
    const onWheel = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      CAM.r = Math.min(300, Math.max(40, CAM.r * Math.exp(e.deltaY * 0.004)));
    };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.style.cursor = 'grab';

    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      if (w / h < 1.05) camera.setViewOffset(w, h, 0, h * 0.02, w, h);
      else camera.clearViewOffset();
      camera.updateProjectionMatrix();
      baseE9 = camera.projectionMatrix.elements[9];
      postResize(w, h);
      vh = h;
      HSPX = w < 640 ? 26 : 30;
      if ((w < 640) !== hsNarrow) { hsNarrow = w < 640; if (hsList.length) setHotspots(hsList); }
      updatePin(); updateLabels();
      needs = true;
    };

    let focusKey = null;
    const focusCam = (code) => {
      const u = U[code];
      if (!u) return;
      const sp = u.sp, cx = (sp.x0 + sp.x1) / 2;
      let az;
      if (sp.row === 'g') az = Math.PI + (cx < 0 ? 0.42 : -0.42);
      else if (sp.row === 'f') az = cx < 0 ? -0.78 : 0.82;
      else az = cx < 0 ? -0.36 : 0.36;
      vel = 0;
      CAM.az = near(az);
      CAM.el = sp.f === 6 ? 0.42 : 0.2;
      CAM.r = 64;
      CAM.tx = cx * 0.85;
      CAM.ty = (LV[sp.f] + LV[sp.f + 1]) / 2;
      CAM.tz = u.top[2] * 0.5;
    };
    const api = {
      update: (next) => {
        const prevIso = S.iso, prevSel = S.sel;
        Object.assign(S, next);
        if (typeof next.orient === 'number') orientDeg = next.orient;
        placeSunViz();
        const focusNow = !!S.focus && !!S.sel && !!U[S.sel] && S.iso === null;
        const garage = !!S.garage, wantG = garage ? ALLG : BUILD;
        if (GHL !== wantG) { GHL = wantG; if (ghostBuilt || garage) buildGhost(); }
        setGhost(focusNow || garage);
        GROUPS.garage.visible = garage;
        GROUPS.ctxN.visible = !garage && FADE.ctxN.op > 0.03;
        GROUPS.ctxS.visible = !garage && FADE.ctxS.op > 0.03;
        for (let f = 0; f <= 6; f++) GROUPS['f' + f].visible = S.iso === null || f <= S.iso;
        GROUPS.roof.visible = S.iso === null;
        applyGhost();
        renderer.shadowMap.needsUpdate = true;
        if (S.iso !== prevIso) {
          if (S.iso !== null) { CAM.el = Math.max(cur.el, 0.78); CAM.r = 86; CAM.ty = LV[S.iso] + 1.5; CAM.tx = 0; CAM.tz = 0; }
          else if (!focusNow) { CAM.el = 0.1; CAM.r = 97; CAM.ty = 12.5; CAM.tx = -2; CAM.tz = -1; }
        }
        const fk = focusNow ? S.sel : null;
        if (fk !== focusKey) {
          if (fk) focusCam(fk);
          else if (focusKey && S.iso === null) { CAM.el = 0.1; CAM.r = 97; CAM.ty = 12.5; CAM.tx = -2; CAM.tz = -1; CAM.az = near(0.6); }
          focusKey = fk;
        }
        if (S.iso !== null && S.sel && S.sel !== prevSel && U[S.sel] && U[S.sel].sp.f === S.iso) {
          const sp = U[S.sel].sp;
          CAM.tx = (sp.x0 + sp.x1) / 2 * 0.7;
        }
        if (next.sun) aimSun(next.sun.az, next.sun.el, !!next.sunNow);
        if (next.hotspots) setHotspots(next.hotspots);
        if (typeof next.hsOn === 'boolean') hsOn = next.hsOn;
        updateHotspots();
        applyUnits(); updatePin(); updateLabels();
        needs = true;
      },
      view: (k) => { const v = VIEWS[k]; if (!v) return; vel = 0; CAM.az = near(v.az); CAM.el = v.el; CAM.r = v.r; CAM.tx = S.iso !== null || camera.aspect < 1.05 ? 0 : (v.tx || 0); CAM.tz = S.iso !== null ? 0 : (v.tz !== undefined ? v.tz : -1); CAM.ty = S.iso !== null ? LV[S.iso] + 1.5 : v.ty; },
      cam: (o) => { vel = 0; Object.assign(CAM, o); },
      rotate: (deg) => { vel = 0; CAM.az += deg * Math.PI / 180; },
      zoom: (k) => { CAM.r = Math.min(300, Math.max(40, CAM.r * k)); },
      face: (code) => { const u = U[code]; if (!u) return; vel = 0; CAM.az = near(u.sp.row === 'g' ? Math.PI - 0.35 : 0.35); },
      sunInfo: () => ({ az: SUN.az, el: SUN.el, anim: sunAnim, ghost: ghostK }),
      stats: () => { let v = 0, fv = 0; scene.traverse((o) => { if (o.isMesh && o.geometry && o.geometry.attributes.position) { v += o.geometry.attributes.position.count; if (o.userData.mk === 'fol') fv += o.geometry.attributes.position.count; } }); return { verts: v, folVerts: fv, calls: renderer.info.render.calls, tris: renderer.info.render.triangles }; },
      resize: resize,
      snap: () => { vel = 0; Object.assign(cur, CAM); if (sunAnim) { sunAnim = false; setSun(SUNT.az, SUNT.el, true); } if (ghostK !== ghostTgt) { ghostK = ghostTgt; applyGhost(); } needs = true; },
      snapshot: () => { applyCam(); draw(); },
      goHotspot: (id) => goHotspot(id),
      dispose: () => {
        alive = false;
        cancelAnimationFrame(raf);
        canvas.removeEventListener('pointerdown', onDown);
        canvas.removeEventListener('pointermove', onMove);
        canvas.removeEventListener('pointerup', onUp);
        canvas.removeEventListener('pointercancel', onUp);
        canvas.removeEventListener('pointerleave', onLeave);
        canvas.removeEventListener('wheel', onWheel);
        scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
        Object.keys(MAT).forEach((k) => MAT[k].dispose());
        Object.keys(T).forEach((k) => T[k].dispose());
        if (envRT) envRT.dispose();
        if (envTimer) clearTimeout(envTimer);
        fadeMats.forEach((m) => m.dispose());
        ghostMat.dispose();
        shTex.dispose();
        sunDisc.material.dispose(); sunTex.dispose();
        pmrem.dispose();
        if (post) {
          [post.scene, post.nrm, post.ao, post.ao2].concat(post.down, post.up).forEach((t) => t.dispose());
          [post.pre, post.dn, post.upm, post.sao, post.blur, post.comp, post.normalMat].forEach((m) => m.dispose());
        }
        fsQuad.geometry.dispose();
        renderer.dispose();
      }
    };
    setSun(SUN.az, SUN.el, true);
    resize();
    applyUnits();
    loop();
    if (hooks.onReady) hooks.onReady();
    return api;
  }

  renderVals() {
    const s = this.S();
    const P = this.P();
    const M = this.model();
    const H = this.handlers();
    const TY = this.TY();
    const t = this.tr();
    const L = this.lang();
    const mode = s.mode || 'facade';
    const type = s.type || 'all';
    const onlyAvail = !!s.onlyAvail;
    const iso = (s.iso === undefined || s.iso === null) ? null : s.iso;
    const selCode = s.sel === undefined ? M.defaultSel : s.sel;
    const sel = selCode ? M.byCode[selCode] : null;
    const hov = s.hov ? M.byCode[s.hov] : null;
    const tm = this.timeState();
    const mInfo = this.MONTHS()[tm.month];
    const sun = this.sunAt(mInfo.doy, tm.hour, mInfo.tz);
    const day = this.dayInfo(tm.month);

    const nf = (n, d) => n.toLocaleString(t.loc, { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
    const eur = (n) => (L === 'en' ? '€' : '€ ') + nf(n);
    const kEur = (n) => {
      if (L === 'en') return n >= 1e6 ? '€' + nf(n / 1e6, 1) + 'm' : '€' + Math.round(n / 1000) + 'k';
      if (L === 'it') return n >= 1e6 ? '€ ' + nf(n / 1e6, 1) + ' mln' : '€ ' + Math.round(n / 1000) + ' mila';
      return n >= 1e6 ? '€ ' + nf(n / 1e6, 1) + ' mi' : '€ ' + Math.round(n / 1000) + ' mil';
    };
    const brl = (n) => {
      const v = n * P.cambio;
      return v >= 1e6 ? 'R$ ' + nf(v / 1e6, 2) + ' mi' : 'R$ ' + nf(Math.round(v / 1000)) + ' mil';
    };
    const ST = { disp: t.disp, res: t.res, vend: t.vend };
    const DOT = { disp: '#D4B571', res: '#8FA7C0', vend: '#8A857C', sel: '#D46B3D' };
    const priceShort = (u) => { const p = this.priceOf(u); return p ? t.from + ' ' + kEur(p) : t.onRequest; };

    const counts = { disp: 0, res: 0, vend: 0 };
    M.units.forEach((u) => { counts[this.st(u)]++; });

    // header languages
    const segOn = 'background:#4B2A1D; color:#FBF8F2;';
    const segOff = 'background:transparent; color:#56463A;';
    const langs = [['pt', 'PT', 'Português'], ['it', 'IT', 'Italiano'], ['en', 'EN', 'English']].map((a) => ({
      code: a[0], label: a[1], name: a[2], pressed: L === a[0] ? 'true' : 'false', style: L === a[0] ? segOn : segOff, pick: H.lang[a[0]]
    }));

    // toolbar
    const chipOn = 'background:#4B2A1D; border:1px solid #4B2A1D; color:#FBF8F2;';
    const chipOff = 'background:#FFFDF8; border:1px solid #D2C4B3; color:#56463A;';
    const groupCount = (g) => M.units.filter((u) => g === 'all' || TY[u.type].group === g).length;
    const typeChips = ['all', 'mono', 'bi', 'tri', 'lux'].map((k) => ({
      label: t.chips[k], count: String(groupCount(k)), pressed: type === k ? 'true' : 'false', style: type === k ? chipOn : chipOff, pick: H.type[k]
    }));

    // sun readout
    const dirIdx = Math.round(sun.az / 45) % 8;
    const sunPos = sun.el > -0.833 ? t.sunUp(t.dirs[dirIdx]) : t.sunDown;
    const sunLine = sunPos.charAt(0).toUpperCase() + sunPos.slice(1) + ' · ' + t.sunrise + ' ' + this.hhmm(day.rise) + ' · ' + t.sunset + ' ' + this.hhmm(day.set);
    const isDay = sun.el > 10;
    const ov = isDay
      ? { bg: '#6f9bd0', title: '#FFFFFF', eyebrow: '#F4F1EA', sub: '#FFFFFF', hint: '#EEF2F7' }
      : { bg: '#0b1020', title: '#FFFFFF', eyebrow: '#F2EDE4', sub: '#FFFFFF', hint: '#EEE9E0' };

    const hovInfo = hov
      ? { on: true, code: hov.code, dot: 'background:' + DOT[this.st(hov)] + ';', line: this.lineOf(hov) + ' · ' + t.ty[hov.type] + ' · ' + (this.st(hov) === 'vend' ? t.vend : priceShort(hov)) }
      : { on: false, code: '', dot: '', line: '' };

    // floors
    const unitChip = (u) => {
      const isSel = !!sel && u.code === sel.code;
      const st = this.st(u);
      return {
        code: u.code,
        sub: t.ty[u.type] + ' · ≈ ' + u.area + ' m²',
        price: st === 'vend' ? t.vend : priceShort(u),
        priceStyle: st === 'vend' ? 'color:#735F50; font-weight:500;' : 'color:#3A2A20;',
        dot: 'background:' + DOT[st] + ';',
        pressed: isSel ? 'true' : 'false',
        style: isSel ? 'background:#F8E7DC; border-color:#D46B3D;' : 'background:#FFFDF8; border-color:#E3D9CC;',
        aria: t.unit + ' ' + u.code + ', ' + this.lineOf(u) + ', ' + t.ty[u.type] + ', ' + ST[st],
        pick: u.pick
      };
    };
    const floors = [1, 2, 3, 4, 5, 6].map((f) => {
      const us = M.byFloor[f];
      const avail = us.filter((u) => this.st(u) === 'disp').length;
      const active = iso === f;
      return {
        num: f === 0 ? 'T' : String(f),
        meta: avail + '/' + us.length,
        aria: t.floorAria(this.floorName(f), avail, us.length),
        pressed: active ? 'true' : 'false',
        rowStyle: active ? 'background:#F8E7DC; border-color:#D46B3D; color:#3A2A20;' : 'background:#FFFDF8; border-color:#E3D9CC; color:#3A2A20;',
        numStyle: active ? 'color:#B4532A;' : 'color:#4B2A1D;',
        pick: H.floor[f]
      };
    });
    const isoUnits = iso !== null ? M.byFloor[iso].map(unitChip) : [];
    const floorHint = iso !== null
      ? t.floorIso(this.floorName(iso), M.byFloor[iso].filter((u) => this.st(u) === 'disp').length, M.byFloor[iso].length)
      : t.floorIdle;

    // unit card
    const PAYK = [['20%', 0.2], ['10%', 0.1], ['10%', 0.1], ['60%', 0.6]];
    let card = { code: '', line: '', typo: '', area: '', extLabel: '', ext: '', floor: '', expo: '', priceLabel: '', price: '', vat: '', priceStyle: '', sub: '', stLabel: '', stStyle: '', dot: '', pay: [], isLink: false, isSold: false, href: '#', cta: '', sunTitle: '', sunValue: '' };
    if (sel) {
      const st = this.st(sel);
      const p = this.priceOf(sel);
      const line = this.lineOf(sel), typo = this.typoOf(sel), tyName = t.ty[sel.type];
      const stStyles = {
        disp: 'background:rgba(212,181,113,.2); color:#6E5221;',
        res: 'background:rgba(143,167,192,.2); color:#3F5A75;',
        vend: 'background:rgba(138,133,124,.18); color:#5F5850;'
      };
      const msg = !p ? t.msgPrices(sel.code, line, tyName) : st === 'res' ? t.msgWait(sel.code) : t.msgInterest(sel.code, line, tyName);
      const sw = this.sunWindows(sel, tm.month);
      const runs = sw.runs.slice(0, 2).map((r) => this.hhmm(r.a) + '–' + this.hhmm(r.b)).join(' · ');
      const PLc = Component.PLANS(t.code), pIdx = { mono: 0, bi: 1, tri: 2, lux: 3 }[TY[sel.type].group] || 0;
      card = {
        planSrc: 'assets/img/plan/plan-t' + (pIdx + 1) + '.jpg', planAlt: PLc.names[pIdx], planTitle: PLc.names[pIdx], planDesc: PLc.d[pIdx], planNote: PLc.note, planOpen: H.open.plans[pIdx], planOpenLabel: PLc.open,
        code: sel.code,
        line: line,
        typo: typo,
        area: '≈ ' + sel.area + ' m²',
        extLabel: t.ext[sel.extKey],
        ext: sel.ext ? '≈ ' + sel.ext + ' m²' : '—',
        floor: this.floorName(sel.f),
        expo: t.expo[sel.row],
        priceLabel: p ? t.pricePreFrom : t.price,
        price: p ? eur(p) : t.onRequest,
        vat: p ? t.vat : '',
        priceStyle: st === 'vend' ? 'text-decoration: line-through; text-decoration-thickness: 1px; color:#735F50;' : '',
        sub: st === 'vend' ? t.soldUnit : p ? (L === 'pt' && P.brl ? t.fx(brl(p), nf(P.cambio, 2)) : t.preNote) : t.tableNote,
        stLabel: ST[st],
        stStyle: stStyles[st],
        dot: 'background:' + DOT[st] + ';',
        pay: PAYK.map((a, i) => ({ pct: a[0], label: t.pay[i], value: p ? eur(Math.round(p * a[1])) : '—' })),
        isLink: st !== 'vend',
        isSold: st === 'vend',
        href: 'https://wa.me/' + P.wa + '?text=' + encodeURIComponent(msg),
        cta: !p ? t.ctaReq : st === 'res' ? t.ctaWait : t.ctaInterest,
        sunTitle: t.sunTitle(t.months[tm.month]),
        sunValue: sw.total > 0.1 ? '≈ ' + nf(sw.total, sw.total < 10 ? 1 : 0) + ' h · ' + runs : t.sunNone
      };
    }

    // project section
    const highlights = t.hi.map((x) => ({ text: x }));
    const table = [
      { line: 'Smart Living', typo: t.tbTypo[0], from: P.studio ? t.from : '', price: P.studio ? eur(P.studio) : t.onRequest },
      { line: 'Comfort Living', typo: t.tbTypo[1], from: P.q1 ? t.from : '', price: P.q1 ? eur(P.q1) : t.onRequest },
      { line: 'Exclusive Living', typo: t.tbTypo[2], from: P.q2 ? t.from : '', price: P.q2 ? eur(P.q2) : t.onRequest },
      { line: 'Luxury Living', typo: t.tbTypo[3], from: '', price: t.onRequest }
    ];
    const payPlan = ['20%', '10%', '10%', '60%'].map((pct, i) => ({ pct: pct, text: t.pf[i] }));

    // neighbourhood map: positions traced from the city map (x, y in map units of 5.36 m)
    const HOME = [463, 365], MPP = 5.36, RF = 1.25;
    const POI = [
      ['prada', 550, 193, 'Fondazione Prada', 'Fondazione Prada, Largo Isarco 2, Milano'],
      ['lodi', 619, 154, 'Lodi T.I.B.B.', 'Lodi T.I.B.B. M3, Milano'],
      ['bocconi', 333, 108, 'Bocconi', 'Università Bocconi, Via Roberto Sarfatti 25, Milano'],
      ['romana', 505, 56, 'Porta Romana', 'Porta Romana M3, Milano'],
      ['duomo', 347, -186, 'Duomo', 'Duomo di Milano']
    ];
    const pois = [], poiDots = [];
    POI.forEach((q, i) => {
      const dx = q[1] - HOME[0], dy = q[2] - HOME[1];
      const d = Math.hypot(dx, dy) * MPP;
      const walk = Math.round(d * RF / 80), bike = Math.max(1, Math.round(d * RF / 250));
      pois.push({ n: String(i + 1), name: t.poi[q[0]], km: t.km(nf(d / 1000, 1)), walk: t.walk(walk), bike: t.bike(bike), route: 'https://www.google.com/maps/dir/?api=1&origin=' + encodeURIComponent('Via Antonio Pasinetti 4, 20141 Milano') + '&destination=' + encodeURIComponent(q[4]) + '&travelmode=walking' });
      let x = q[1], y = q[2], capped = false;
      if (y < 36) { const k = (HOME[1] - 36) / (HOME[1] - y); x = HOME[0] + dx * k; y = 36; capped = true; }
      const lx = (x - 215) / 5.6, ly = (y - 20) / 4.2;
      poiDots.push({
        n: String(i + 1),
        short: q[3] + (capped ? ' · ' + nf(d / 1000, 1) + ' km ↑' : ''),
        style: 'top:' + ly.toFixed(2) + '%; left:' + lx.toFixed(2) + '%; transform: translate(-11px, -50%);',
        labelStyle: s.narrow ? 'display:none;' : ''
      });
    });

    const MD = this.MEDIA();
    const wideV = !s.narrow;
    const PL = Component.PLANS(t.code);
    const setTitle = (k) => (k === 'plans' ? PL.title : k === 'ext' ? t.glTitle : t.am[k] ? t.am[k].t : t.styles[k]);
    const altOf = (k, i) => (k === 'plans' ? PL.names[i] : k === 'ext' ? t.extAlts.concat(t.alts.slice(1))[i] : setTitle(k) + ' · ' + t.lbCount(i + 1, MD.sets[k].length));
    const amen = MD.amen.map((k, idx) => ({
      img: MD.sets[k][0].t, title: t.am[k].t, desc: t.am[k].d, count: t.photos(MD.sets[k].length),
      aria: t.am[k].t + ' — ' + t.am[k].d + ' (' + t.photos(MD.sets[k].length) + ')', pick: H.open[k][0],
      cell: wideV && [0, 1, 3, 7].indexOf(idx) >= 0 ? 'grid-column: span 2;' : ''
    }));
    const inStyle = s.inStyle === 'brown' ? 'brown' : 'chiara';
    const styleTabs = ['chiara', 'brown'].map((k) => ({
      label: t.styles[k], pressed: inStyle === k ? 'true' : 'false', pick: H.style[k],
      style: inStyle === k ? 'background:#4B2A1D; color:#FBF8F2;' : 'background:transparent; color:#56463A;'
    }));
    const inImgs = MD.sets[inStyle].map((m, i) => ({
      src: i === 0 ? m.f : m.t, alt: altOf(inStyle, i), aria: t.enlarge + ': ' + altOf(inStyle, i), pick: H.open[inStyle][i],
      cell: i === 0 ? 'grid-column: 1 / -1; aspect-ratio: 21 / 9;' : 'aspect-ratio: 16 / 10;'
    }));
    const fins = t.fin.map((f, i) => ({ img: MD.fin[i], cat: f[0], prod: f[1], brand: f[2] }));
    const galHero = { src: MD.sets.ext[0].f, alt: altOf('ext', 0), aria: t.enlarge + ': ' + altOf('ext', 0), pick: H.open.ext[0] };
    const galItems = MD.sets.ext.slice(1).map((m, i) => ({ src: m.t, alt: altOf('ext', i + 1), aria: t.enlarge + ': ' + altOf('ext', i + 1), pick: H.open.ext[i + 1], cell: i === 0 && wideV ? 'grid-column: span 2;' : '' }));
    const rk = s.real && MD.sets[s.real] ? s.real : null;
    const ri = rk ? Math.min(MD.sets[rk].length - 1, Math.max(0, s.realI || 0)) : 0;
    const realV = rk
      ? { on: true, src: MD.sets[rk][ri].f, title: rk === 'real' ? t.realTitle : t.am[rk].t, desc: rk === 'real' ? t.realHint : t.am[rk].d, count: t.lbCount(ri + 1, MD.sets[rk].length), multi: MD.sets[rk].length > 1, alt: rk === 'real' ? t.extAlts.concat([t.am.garden.t, t.am.garden.d])[ri] : altOf(rk, ri) }
      : { on: false, src: '', title: '', desc: '', count: '', multi: false, alt: '' };
    const lk = s.lbSet && MD.sets[s.lbSet] ? s.lbSet : null;
    const li = lk ? Math.min(MD.sets[lk].length - 1, Math.max(0, s.lbI || 0)) : 0;
    const lb = lk
      ? { open: true, src: MD.sets[lk][li].f, alt: altOf(lk, li), title: setTitle(lk), count: t.lbCount(li + 1, MD.sets[lk].length), multi: MD.sets[lk].length > 1 }
      : { open: false, src: '', alt: '', title: '', count: '', multi: false };
    const wide = !s.narrow;
    const focusOn = !!s.focus && !!sel && iso === null;
    const garageOn = !!s.garage && !rk && iso === null && !s.focus;

    return {
      t: t,
      ov: ov,
      wide: wide,
      langs: langs,
      hintOn: wide && !hov && !(s.focus && sel && iso === null),
      subOn: wide && !(s.focus && sel && iso === null),
      visitHref: 'https://wa.me/' + P.wa + '?text=' + encodeURIComponent(t.msgVisit),
      typeChips: typeChips,
      onlyAvail: onlyAvail,
      toggleAvail: H.toggleAvail,
      statusOn: mode === 'status',
      toggleMode: H.toggleMode,
      stageRef: H.stageRef,
      canvasRef: H.canvasRef,
      loading: !s.ready && !s.glErr,
      glErr: !!s.glErr,
      hovInfo: hovInfo,
      sunLine: sunLine,
      month: tm.month,
      hour: tm.hour,
      hourText: this.hhmm(tm.hour),
      setMonth: H.setMonth,
      setHour: H.setHour,
      viewSun: H.viewSun,
      mapHref: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Via Antonio Pasinetti 4, 20141 Milano'),
      togglePlay: H.togglePlay,
      playing: !!s.playing,
      notPlaying: !s.playing,
      playLabel: s.playing ? t.pause : t.play,
      focusOn: focusOn,
      exitFocus: H.exitFocus,
      garageOn: garageOn,
      viewGarage: H.viewGarage,
      garageBack: H.viewStreet,
      garageBtnStyle: garageOn ? 'background: #4B2A1D; color: #FBF8F2;' : 'background: transparent; color: #3A2A20;',
      showLegend: mode === 'status' || iso !== null || type !== 'all' || onlyAvail,
      counts: counts,
      viewStreet: H.viewStreet,
      viewGarden: H.viewGarden,
      viewAir: H.viewAir,
      rotL: H.rotL,
      rotR: H.rotR,
      zoomIn: H.zoomIn,
      zoomOut: H.zoomOut,
      hasCard: !!sel,
      noCard: !sel,
      card: card,
      similar: H.similar,
      locate: H.locate,
      isIso: iso !== null,
      allFloors: H.allFloors,
      floors: floors,
      isoUnits: isoUnits,
      floorHint: floorHint,
      highlights: highlights,
      table: table,
      payPlan: payPlan,
      pois: pois,
      poiDots: poiDots,
      amen: amen,
      styleTabs: styleTabs,
      inImgs: inImgs,
      styleNote: t.styleNote[inStyle],
      fins: fins,
      galHero: galHero,
      galItems: galItems,
      gx: Component.GESTAO(t.code),
      planCommonTitle: PL.common,
      planCommon: [4, 5].map((i) => ({ src: 'assets/img/plan/plan-' + (i === 4 ? 'terreo' : 'rooftop') + '.jpg', label: PL.names[i], aria: PL.open + ' · ' + PL.names[i], pick: H.open.plans[i] })),
      lb: lb,
      lbClose: H.lbClose,
      realV: realV,
      realOpen: H.realOpen,
      realClose: H.realClose,
      realPrev: H.realPrev,
      realNext: H.realNext,
      lbPrev: H.lbPrev,
      lbNext: H.lbNext
    };
  }
}
;window.__dcStart(Component);
