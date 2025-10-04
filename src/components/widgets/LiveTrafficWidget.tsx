'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

interface FlightData {
  id: number;
  callsign: string;
  aircraft: string;
  departure: string;
  arrival: string;
  altitude: number;
  groundSpeed: number;
  heading: number;
  state: string;
  latitude: number;
  longitude: number;
  onGround: boolean;
  timestamp: string;
}

interface IVAOData {
  updatedAt: string;
  clients: {
    pilots: Array<{
      id: number;
      callsign: string;
      lastTrack: {
        altitude: number;
        groundSpeed: number;
        heading: number;
        latitude: number;
        longitude: number;
        onGround: boolean;
        state: string;
        timestamp: string;
      };
      flightPlan: {
        aircraftId: string;
        departureId: string;
        arrivalId: string;
        aircraft: {
          model: string;
        };
      };
    }>;
  };
}

const LiveTrafficWidget = () => {
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Middle East FIR airports - All airports in OJAC, OSTT, ORBB FIRs
  const middleEastAirports = useMemo(() => [
    // OJAC FIR (Jordan)
    'OJAI', 'OJAM', 'OJAQ', 'OJMF', 'OJMN', 'OJMR', 'OJMS', 'OJQN', 'OJQO', 'OJQS', 'OJQT', 'OJQU', 'OJQV', 'OJQW', 'OJQX', 'OJQY', 'OJQZ', 'OJRA', 'OJRB', 'OJRC', 'OJRD', 'OJRE', 'OJRF', 'OJRG', 'OJRH', 'OJRI', 'OJRJ', 'OJRK', 'OJRL', 'OJRM', 'OJRN', 'OJRO', 'OJRQ', 'OJRR', 'OJRS', 'OJRT', 'OJRV', 'OJRW', 'OJRX', 'OJRZ', 'OJSA', 'OJSC', 'OJSD', 'OJSE', 'OJSH', 'OJSJ', 'OJSL', 'OJSM', 'OJSN', 'OJSO', 'OJSP', 'OJSQ', 'OJSR', 'OJSS', 'OJST', 'OJSU', 'OJSV', 'OJSW', 'OJSX', 'OJSY', 'OJSZ', 'OJTA', 'OJTB', 'OJTC', 'OJTD', 'OJTE', 'OJTF', 'OJTJ', 'OJTK', 'OJTL', 'OJTM', 'OJTN', 'OJTO', 'OJTP', 'OJTQ', 'OJTR', 'OJTS', 'OJTT', 'OJTZ', 'OJUA', 'OJUB', 'OJUC', 'OJUD', 'OJUH', 'OJUJ', 'OJUQ', 'OJUR', 'OJUS', 'OJUT', 'OJUU', 'OJUW', 'OJUY', 'OJUZ', 'OJVA', 'OJVB', 'OJVC', 'OJVD', 'OJVE', 'OJVF', 'OJVG', 'OJVH', 'OJVJ', 'OJVK', 'OJVN', 'OJVQ', 'OJVU', 'OJVW', 'OJVX', 'OJVY', 'OJVZ', 'OJWA', 'OJWB', 'OJWC', 'OJWD', 'OJWE', 'OJWF', 'OJWG', 'OJWH', 'OJWJ', 'OJWK', 'OJWQ', 'OJWR', 'OJWS', 'OJWT', 'OJWU', 'OJWX', 'OJWY', 'OJWZ', 'OJXA', 'OJXB', 'OJXC', 'OJXD', 'OJXE', 'OJXF', 'OJXG', 'OJXH', 'OJXJ', 'OJXK', 'OJXL', 'OJXM', 'OJXN', 'OJXO', 'OJXP', 'OJXQ', 'OJXR', 'OJXS', 'OJXT', 'OJXU', 'OJXV', 'OJXW', 'OJXX', 'OJXY', 'OJXZ', 'OJYA', 'OJYB', 'OJYC', 'OJYD', 'OJYE', 'OJYF', 'OJYG', 'OJYH', 'OJYJ', 'OJYK', 'OJYL', 'OJYM', 'OJYN', 'OJYO', 'OJYP', 'OJYQ', 'OJYR', 'OJYS', 'OJYT', 'OJYU', 'OJYV', 'OJYW', 'OJYX', 'OJYY', 'OJYZ', 'OJZA', 'OJZB', 'OJZC', 'OJZD', 'OJZE', 'OJZF', 'OJZG', 'OJZH', 'OJZJ', 'OJZK', 'OJZL', 'OJZM', 'OJZN', 'OJZO', 'OJZP', 'OJZQ', 'OJZR', 'OJZS', 'OJZT', 'OJZU', 'OJZV', 'OJZW', 'OJZX', 'OJZY', 'OJZZ',
    
    // OSTT FIR (Syria)
    'OSDI', 'OSLK', 'OSPR', 'OSKL', 'OSDZ', 'OSKF', 'OSKG', 'OSKH', 'OSKI', 'OSKJ', 'OSKK', 'OSKM', 'OSKN', 'OSKO', 'OSKP', 'OSKQ', 'OSKR', 'OSKS', 'OSKT', 'OSKU', 'OSKV', 'OSKW', 'OSKX', 'OSKY', 'OSKZ', 'OSLA', 'OSLB', 'OSLC', 'OSLD', 'OSLE', 'OSLF', 'OSLG', 'OSLH', 'OSLI', 'OSLJ', 'OSLM', 'OSLN', 'OSLO', 'OSLP', 'OSLQ', 'OSLR', 'OSLS', 'OSLT', 'OSLU', 'OSLV', 'OSLW', 'OSLX', 'OSLY', 'OSLZ', 'OSMA', 'OSMB', 'OSMC', 'OSMD', 'OSME', 'OSMF', 'OSMG', 'OSMH', 'OSMI', 'OSMJ', 'OSMK', 'OSML', 'OSMM', 'OSMN', 'OSMO', 'OSMP', 'OSMQ', 'OSMR', 'OSMS', 'OSMT', 'OSMU', 'OSMV', 'OSMW', 'OSMX', 'OSMY', 'OSMZ', 'OSNA', 'OSNB', 'OSNC', 'OSND', 'OSNE', 'OSNF', 'OSNG', 'OSNH', 'OSNI', 'OSNJ', 'OSNK', 'OSNL', 'OSNM', 'OSNN', 'OSNO', 'OSNP', 'OSNQ', 'OSNR', 'OSNS', 'OSNT', 'OSNU', 'OSNV', 'OSNW', 'OSNX', 'OSNY', 'OSNZ', 'OSOA', 'OSOB', 'OSOC', 'OSOD', 'OSOE', 'OSOF', 'OSOG', 'OSOH', 'OSOI', 'OSOJ', 'OSOK', 'OSOL', 'OSOM', 'OSON', 'OSOO', 'OSOP', 'OSOQ', 'OSOR', 'OSOS', 'OSOT', 'OSOU', 'OSOV', 'OSOW', 'OSOX', 'OSOY', 'OSOZ', 'OSPA', 'OSPB', 'OSPC', 'OSPD', 'OSPE', 'OSPF', 'OSPG', 'OSPH', 'OSPI', 'OSPJ', 'OSPK', 'OSPL', 'OSPM', 'OSPN', 'OSPO', 'OSPP', 'OSPQ', 'OSPR', 'OSPS', 'OSPT', 'OSPU', 'OSPV', 'OSPW', 'OSPX', 'OSPY', 'OSPZ', 'OSQA', 'OSQB', 'OSQC', 'OSQD', 'OSQE', 'OSQF', 'OSQG', 'OSQH', 'OSQI', 'OSQJ', 'OSQK', 'OSQL', 'OSQM', 'OSQN', 'OSQO', 'OSQP', 'OSQQ', 'OSQR', 'OSQS', 'OSQT', 'OSQU', 'OSQV', 'OSQW', 'OSQX', 'OSQY', 'OSQZ', 'OSRA', 'OSRB', 'OSRC', 'OSRD', 'OSRE', 'OSRF', 'OSRG', 'OSRH', 'OSRI', 'OSRJ', 'OSRK', 'OSRL', 'OSRM', 'OSRN', 'OSRO', 'OSRP', 'OSRQ', 'OSRR', 'OSRS', 'OSRT', 'OSRU', 'OSRV', 'OSRW', 'OSRX', 'OSRY', 'OSRZ', 'OSSA', 'OSSB', 'OSSC', 'OSSD', 'OSSE', 'OSSF', 'OSSG', 'OSSH', 'OSSI', 'OSSJ', 'OSSK', 'OSSL', 'OSSM', 'OSSN', 'OSSO', 'OSSP', 'OSSQ', 'OSSR', 'OSSS', 'OSST', 'OSSU', 'OSSV', 'OSSW', 'OSSX', 'OSSY', 'OSSZ', 'OSTA', 'OSTB', 'OSTC', 'OSTD', 'OSTE', 'OSTF', 'OSTG', 'OSTH', 'OSTI', 'OSTJ', 'OSTK', 'OSTL', 'OSTM', 'OSTN', 'OSTO', 'OSTP', 'OSTQ', 'OSTR', 'OSTS', 'OSTT', 'OSTU', 'OSTV', 'OSTW', 'OSTX', 'OSTY', 'OSTZ', 'OSUA', 'OSUB', 'OSUC', 'OSUD', 'OSUE', 'OSUF', 'OSUG', 'OSUH', 'OSUI', 'OSUJ', 'OSUK', 'OSUL', 'OSUM', 'OSUN', 'OSUO', 'OSUP', 'OSUQ', 'OSUR', 'OSUS', 'OSUT', 'OSUU', 'OSUV', 'OSUW', 'OSUX', 'OSUY', 'OSUZ', 'OSVA', 'OSVB', 'OSVC', 'OSVD', 'OSVE', 'OSVF', 'OSVG', 'OSVH', 'OSVI', 'OSVJ', 'OSVK', 'OSVL', 'OSVM', 'OSVN', 'OSVO', 'OSVP', 'OSVQ', 'OSVR', 'OSVS', 'OSVT', 'OSVU', 'OSVV', 'OSVW', 'OSVX', 'OSVY', 'OSVZ', 'OSWA', 'OSWB', 'OSWC', 'OSWD', 'OSWE', 'OSWF', 'OSWG', 'OSWH', 'OSWI', 'OSWJ', 'OSWK', 'OSWL', 'OSWM', 'OSWN', 'OSWO', 'OSWP', 'OSWQ', 'OSWR', 'OSWS', 'OSWT', 'OSWU', 'OSWV', 'OSWW', 'OSWX', 'OSWY', 'OSWZ', 'OSXA', 'OSXB', 'OSXC', 'OSXD', 'OSXE', 'OSXF', 'OSXG', 'OSXH', 'OSXI', 'OSXJ', 'OSXK', 'OSXL', 'OSXM', 'OSXN', 'OSXO', 'OSXP', 'OSXQ', 'OSXR', 'OSXS', 'OSXT', 'OSXU', 'OSXV', 'OSXW', 'OSXX', 'OSXY', 'OSXZ', 'OSYA', 'OSYB', 'OSYC', 'OSYD', 'OSYE', 'OSYF', 'OSYG', 'OSYH', 'OSYI', 'OSYJ', 'OSYK', 'OSYL', 'OSYM', 'OSYN', 'OSYO', 'OSYP', 'OSYQ', 'OSYR', 'OSYS', 'OSYT', 'OSYU', 'OSYV', 'OSYW', 'OSYX', 'OSYY', 'OSYZ', 'OSZA', 'OSZB', 'OSZC', 'OSZD', 'OSZE', 'OSZF', 'OSZG', 'OSZH', 'OSZI', 'OSZJ', 'OSZK', 'OSZL', 'OSZM', 'OSZN', 'OSZO', 'OSZP', 'OSZQ', 'OSZR', 'OSZS', 'OSZT', 'OSZU', 'OSZV', 'OSZW', 'OSZX', 'OSZY', 'OSZZ',
    
    // ORBB FIR (Iraq)
    'ORBI', 'ORBM', 'ORBS', 'ORER', 'ORMM', 'ORNI', 'ORSU', 'ORTL', 'ORAA', 'ORAB', 'ORAC', 'ORAD', 'ORAE', 'ORAF', 'ORAG', 'ORAH', 'ORAI', 'ORAJ', 'ORAK', 'ORAL', 'ORAM', 'ORAN', 'ORAO', 'ORAP', 'ORAQ', 'ORAR', 'ORAS', 'ORAT', 'ORAU', 'ORAV', 'ORAW', 'ORAX', 'ORAY', 'ORAZ', 'ORBA', 'ORBB', 'ORBC', 'ORBD', 'ORBE', 'ORBF', 'ORBG', 'ORBH', 'ORBI', 'ORBJ', 'ORBK', 'ORBL', 'ORBM', 'ORBN', 'ORBO', 'ORBP', 'ORBQ', 'ORBR', 'ORBS', 'ORBT', 'ORBU', 'ORBV', 'ORBW', 'ORBX', 'ORBY', 'ORBZ', 'ORCA', 'ORCB', 'ORCC', 'ORCD', 'ORCE', 'ORCF', 'ORCG', 'ORCH', 'ORCI', 'ORCJ', 'ORCK', 'ORCL', 'ORCM', 'ORCN', 'ORCO', 'ORCP', 'ORCQ', 'ORCR', 'ORCS', 'ORCT', 'ORCU', 'ORCV', 'ORCW', 'ORCX', 'ORCY', 'ORCZ', 'ORDA', 'ORDB', 'ORDC', 'ORDD', 'ORDE', 'ORDF', 'ORDG', 'ORDH', 'ORDI', 'ORDJ', 'ORDK', 'ORDL', 'ORDM', 'ORDN', 'ORDO', 'ORDP', 'ORDQ', 'ORDR', 'ORDS', 'ORDT', 'ORDU', 'ORDV', 'ORDW', 'ORDX', 'ORDY', 'ORDZ', 'OREA', 'OREB', 'OREC', 'ORED', 'OREE', 'OREF', 'OREG', 'OREH', 'OREI', 'OREJ', 'OREK', 'OREL', 'OREM', 'OREN', 'OREO', 'OREP', 'OREQ', 'ORER', 'ORES', 'ORET', 'OREU', 'OREV', 'OREW', 'OREX', 'OREY', 'OREZ', 'ORFA', 'ORFB', 'ORFC', 'ORFD', 'ORFE', 'ORFF', 'ORFG', 'ORFH', 'ORFI', 'ORFJ', 'ORFK', 'ORFL', 'ORFM', 'ORFN', 'ORFO', 'ORFP', 'ORFQ', 'ORFR', 'ORFS', 'ORFT', 'ORFU', 'ORFV', 'ORFW', 'ORFX', 'ORFY', 'ORFZ', 'ORGA', 'ORGB', 'ORGC', 'ORGD', 'ORGE', 'ORGF', 'ORGG', 'ORGH', 'ORGI', 'ORGJ', 'ORGK', 'ORGL', 'ORGM', 'ORGN', 'ORGO', 'ORGP', 'ORGQ', 'ORGR', 'ORGS', 'ORGT', 'ORGU', 'ORGV', 'ORGW', 'ORGX', 'ORGY', 'ORGZ', 'ORHA', 'ORHB', 'ORHC', 'ORHD', 'ORHE', 'ORHF', 'ORHG', 'ORHH', 'ORHI', 'ORHJ', 'ORHK', 'ORHL', 'ORHM', 'ORHN', 'ORHO', 'ORHP', 'ORHQ', 'ORHR', 'ORHS', 'ORHT', 'ORHU', 'ORHV', 'ORHW', 'ORHX', 'ORHY', 'ORHZ', 'ORIA', 'ORIB', 'ORIC', 'ORID', 'ORIE', 'ORIF', 'ORIG', 'ORIH', 'ORII', 'ORIJ', 'ORIK', 'ORIL', 'ORIM', 'ORIN', 'ORIO', 'ORIP', 'ORIQ', 'ORIR', 'ORIS', 'ORIT', 'ORIU', 'ORIV', 'ORIW', 'ORIX', 'ORIY', 'ORIZ', 'ORJA', 'ORJB', 'ORJC', 'ORJD', 'ORJE', 'ORJF', 'ORJG', 'ORJH', 'ORJI', 'ORJJ', 'ORJK', 'ORJL', 'ORJM', 'ORJN', 'ORJO', 'ORJP', 'ORJQ', 'ORJR', 'ORJS', 'ORJT', 'ORJU', 'ORJV', 'ORJW', 'ORJX', 'ORJY', 'ORJZ', 'ORKA', 'ORKB', 'ORKC', 'ORKD', 'ORKE', 'ORKF', 'ORKG', 'ORKH', 'ORKI', 'ORKJ', 'ORKK', 'ORKL', 'ORKM', 'ORKN', 'ORKO', 'ORKP', 'ORKQ', 'ORKR', 'ORKS', 'ORKT', 'ORKU', 'ORKV', 'ORKW', 'ORKX', 'ORKY', 'ORKZ', 'ORLA', 'ORLB', 'ORLC', 'ORLD', 'ORLE', 'ORLF', 'ORLG', 'ORLH', 'ORLI', 'ORLJ', 'ORLK', 'ORLL', 'ORLM', 'ORLN', 'ORLO', 'ORLP', 'ORLQ', 'ORLR', 'ORLS', 'ORLT', 'ORLU', 'ORLV', 'ORLW', 'ORLX', 'ORLY', 'ORLZ', 'ORMA', 'ORMB', 'ORMC', 'ORMD', 'ORME', 'ORMF', 'ORMG', 'ORMH', 'ORMI', 'ORMJ', 'ORMK', 'ORML', 'ORMM', 'ORMN', 'ORMO', 'ORMP', 'ORMQ', 'ORMR', 'ORMS', 'ORMT', 'ORMU', 'ORMV', 'ORMW', 'ORMX', 'ORMY', 'ORMZ', 'ORNA', 'ORNB', 'ORNC', 'ORND', 'ORNE', 'ORNF', 'ORNG', 'ORNH', 'ORNI', 'ORNJ', 'ORNK', 'ORNL', 'ORNM', 'ORNN', 'ORNO', 'ORNP', 'ORNQ', 'ORNR', 'ORNS', 'ORNT', 'ORNU', 'ORNV', 'ORNW', 'ORNX', 'ORNY', 'ORNZ', 'OROA', 'OROB', 'OROC', 'OROD', 'OROE', 'OROF', 'OROG', 'OROH', 'OROI', 'OROJ', 'OROK', 'OROL', 'OROM', 'ORON', 'OROO', 'OROP', 'OROQ', 'OROR', 'OROS', 'OROT', 'OROU', 'OROV', 'OROW', 'OROX', 'OROY', 'OROZ', 'ORPA', 'ORPB', 'ORPC', 'ORPD', 'ORPE', 'ORPF', 'ORPG', 'ORPH', 'ORPI', 'ORPJ', 'ORPK', 'ORPL', 'ORPM', 'ORPN', 'ORPO', 'ORPP', 'ORPQ', 'ORPR', 'ORPS', 'ORPT', 'ORPU', 'ORPV', 'ORPW', 'ORPX', 'ORPY', 'ORPZ', 'ORQA', 'ORQB', 'ORQC', 'ORQD', 'ORQE', 'ORQF', 'ORQG', 'ORQH', 'ORQI', 'ORQJ', 'ORQK', 'ORQL', 'ORQM', 'ORQN', 'ORQO', 'ORQP', 'ORQQ', 'ORQR', 'ORQS', 'ORQT', 'ORQU', 'ORQV', 'ORQW', 'ORQX', 'ORQY', 'ORQZ', 'ORRA', 'ORRB', 'ORRC', 'ORRD', 'ORRE', 'ORRF', 'ORRG', 'ORRH', 'ORRI', 'ORRJ', 'ORRK', 'ORRL', 'ORRM', 'ORRN', 'ORRO', 'ORRP', 'ORRQ', 'ORRR', 'ORRS', 'ORRT', 'ORRU', 'ORRV', 'ORRW', 'ORRX', 'ORRY', 'ORRZ', 'ORSA', 'ORSB', 'ORSC', 'ORSD', 'ORSE', 'ORSF', 'ORSG', 'ORSH', 'ORSI', 'ORSJ', 'ORSK', 'ORSL', 'ORSM', 'ORSN', 'ORSO', 'ORSP', 'ORSQ', 'ORSR', 'ORSS', 'ORST', 'ORSU', 'ORSV', 'ORSW', 'ORSX', 'ORSY', 'ORSZ', 'ORTA', 'ORTB', 'ORTC', 'ORTD', 'ORTE', 'ORTF', 'ORTG', 'ORTH', 'ORTI', 'ORTJ', 'ORTK', 'ORTL', 'ORTM', 'ORTN', 'ORTO', 'ORTP', 'ORTQ', 'ORTR', 'ORTS', 'ORTT', 'ORTU', 'ORTV', 'ORTW', 'ORTX', 'ORTY', 'ORTZ', 'ORUA', 'ORUB', 'ORUC', 'ORUD', 'ORUE', 'ORUF', 'ORUG', 'ORUH', 'ORUI', 'ORUJ', 'ORUK', 'ORUL', 'ORUM', 'ORUN', 'ORUO', 'ORUP', 'ORUQ', 'ORUR', 'ORUS', 'ORUT', 'ORUU', 'ORUV', 'ORUW', 'ORUX', 'ORUY', 'ORUZ', 'ORVA', 'ORVB', 'ORVC', 'ORVD', 'ORVE', 'ORVF', 'ORVG', 'ORVH', 'ORVI', 'ORVJ', 'ORVK', 'ORVL', 'ORVM', 'ORVN', 'ORVO', 'ORVP', 'ORVQ', 'ORVR', 'ORVS', 'ORVT', 'ORVU', 'ORVV', 'ORVW', 'ORVX', 'ORVY', 'ORVZ', 'ORWA', 'ORWB', 'ORWC', 'ORWD', 'ORWE', 'ORWF', 'ORWG', 'ORWH', 'ORWI', 'ORWJ', 'ORWK', 'ORWL', 'ORWM', 'ORWN', 'ORWO', 'ORWP', 'ORWQ', 'ORWR', 'ORWS', 'ORWT', 'ORWU', 'ORWV', 'ORWW', 'ORWX', 'ORWY', 'ORWZ', 'ORXA', 'ORXB', 'ORXC', 'ORXD', 'ORXE', 'ORXF', 'ORXG', 'ORXH', 'ORXI', 'ORXJ', 'ORXK', 'ORXL', 'ORXM', 'ORXN', 'ORXO', 'ORXP', 'ORXQ', 'ORXR', 'ORXS', 'ORXT', 'ORXU', 'ORXV', 'ORXW', 'ORXX', 'ORXY', 'ORXZ', 'ORYA', 'ORYB', 'ORYC', 'ORYD', 'ORYE', 'ORYF', 'ORYG', 'ORYH', 'ORYI', 'ORYJ', 'ORYK', 'ORYL', 'ORYM', 'ORYN', 'ORYO', 'ORYP', 'ORYQ', 'ORYR', 'ORYS', 'ORYT', 'ORYU', 'ORYV', 'ORYW', 'ORYX', 'ORYY', 'ORYZ', 'ORZA', 'ORZB', 'ORZC', 'ORZD', 'ORZE', 'ORZF', 'ORZG', 'ORZH', 'ORZI', 'ORZJ', 'ORZK', 'ORZL', 'ORZM', 'ORZN', 'ORZO', 'ORZP', 'ORZQ', 'ORZR', 'ORZS', 'ORZT', 'ORZU', 'ORZV', 'ORZW', 'ORZX', 'ORZY', 'ORZZ'
  ], []);

  const fetchTrafficData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://api.ivao.aero/v2/tracker/whazzup');
      if (!response.ok) {
        throw new Error('Failed to fetch traffic data');
      }
      
      const data: IVAOData = await response.json();
      
      // Filter flights by Middle East FIR airports (both departures and arrivals)
      const filteredFlights = data.clients.pilots
        .filter(pilot => {
          if (!pilot.flightPlan) return false;
          
          const departure = pilot.flightPlan.departureId;
          const arrival = pilot.flightPlan.arrivalId;
          
          // Show flights that either depart from or arrive at Middle East FIR airports
          return middleEastAirports.includes(departure) || middleEastAirports.includes(arrival);
        })
        .map(pilot => ({
          id: pilot.id,
          callsign: pilot.callsign,
          aircraft: pilot.flightPlan?.aircraft?.model || pilot.flightPlan?.aircraftId || 'Unknown',
          departure: pilot.flightPlan?.departureId || 'N/A',
          arrival: pilot.flightPlan?.arrivalId || 'N/A',
          altitude: pilot.lastTrack?.altitude || 0,
          groundSpeed: pilot.lastTrack?.groundSpeed || 0,
          heading: pilot.lastTrack?.heading || 0,
          state: pilot.lastTrack?.state || 'Unknown',
          latitude: pilot.lastTrack?.latitude || 0,
          longitude: pilot.lastTrack?.longitude || 0,
          onGround: pilot.lastTrack?.onGround || false,
          timestamp: pilot.lastTrack?.timestamp || ''
        }))
        .slice(0, 10); // Limit to 10 flights for display
      
      setFlights(filteredFlights);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [middleEastAirports]);

  useEffect(() => {
    fetchTrafficData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchTrafficData, 30000);
    
    return () => clearInterval(interval);
  }, [fetchTrafficData]);

  const formatAltitude = (altitude: number) => {
    if (altitude < 1000) return `${altitude}ft`;
    return `FL${Math.floor(altitude / 100)}`;
  };

  const formatSpeed = (speed: number) => {
    return `${speed}kts`;
  };

  const getHeadingArrow = (heading: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(heading / 45) % 8;
    return directions[index];
  };

  const getStateColor = (state: string) => {
    switch (state.toLowerCase()) {
      case 'en route':
        return 'text-blue-400';
      case 'departing':
        return 'text-green-400';
      case 'arriving':
        return 'text-yellow-400';
      case 'landed':
        return 'text-gray-400';
      default:
        return 'text-white';
    }
  };

  const getFlightType = (departure: string, arrival: string) => {
    const isDeparture = middleEastAirports.includes(departure);
    const isArrival = middleEastAirports.includes(arrival);
    
    if (isDeparture && isArrival) {
      return { type: 'both', icon: '🔄', label: 'DOMESTIC' };
    } else if (isDeparture) {
      return { type: 'departure', icon: '✈️', label: 'DEP' };
    } else if (isArrival) {
      return { type: 'arrival', icon: '🛬', label: 'ARR' };
    }
    return { type: 'unknown', icon: '❓', label: 'UNKNOWN' };
  };

  if (loading) {
    return (
      <div className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-64 mx-auto mb-6"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-600 rounded w-24"></div>
                      <div className="h-4 bg-gray-600 rounded w-32"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Live Traffic - Middle East FIR</h2>
          <p className="text-gray-400 text-sm mb-4">
            Real-time departures and arrivals from IVAO network
          </p>
        </div>

        {error ? (
          <div className="text-center">
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400">⚠️ {error}</p>
              <button
                onClick={fetchTrafficData}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : flights.length === 0 ? (
          <div className="text-center">
            <div className="bg-gray-700 rounded-lg p-8">
              <p className="text-gray-400 text-lg">No flights found</p>
              <p className="text-gray-500 text-sm mt-2">
                No flights from Middle East FIR airports at the moment
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {flights.map((flight) => {
              const flightType = getFlightType(flight.departure, flight.arrival);
              return (
                <div key={flight.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-blue-400">{flight.callsign}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStateColor(flight.state)} bg-gray-600`}>
                          {flight.state}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          flightType.type === 'departure' ? 'bg-green-600 text-white' :
                          flightType.type === 'arrival' ? 'bg-yellow-600 text-white' :
                          flightType.type === 'both' ? 'bg-purple-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {flightType.icon} {flightType.label}
                        </span>
                      </div>
                      <div className="text-sm text-gray-300">
                        {flight.aircraft}
                      </div>
                    </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-400">Route:</span>
                      <span className="text-white font-medium">{flight.departure}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-white font-medium">{flight.arrival}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-400">Alt:</span>
                      <span className="text-green-400 font-medium">{formatAltitude(flight.altitude)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-400">Speed:</span>
                      <span className="text-yellow-400 font-medium">{formatSpeed(flight.groundSpeed)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-400">HDG:</span>
                      <span className="text-purple-400 font-medium">{flight.heading}°</span>
                      <span className="text-lg">{getHeadingArrow(flight.heading)}</span>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">Last updated: {lastUpdate || 'Never'}</p>
        </div>
      </div>
    </div>
  );
};

export default LiveTrafficWidget;
