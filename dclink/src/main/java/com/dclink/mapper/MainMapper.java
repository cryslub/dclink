package com.dclink.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.dclink.pojo.Candidate;
import com.dclink.pojo.Council;
import com.dclink.pojo.Election;
import com.dclink.pojo.History;
import com.dclink.pojo.Inspection;
import com.dclink.pojo.Item;
import com.dclink.pojo.Party;
import com.dclink.pojo.Person;
import com.dclink.pojo.Rate;
import com.dclink.pojo.State;
import com.dclink.pojo.Sub;
import com.dclink.pojo.Zone;

@Mapper
public interface MainMapper {
	@Select("select id,name,type,result from election order by date desc")
	public List<Election> getAllElection();

	@Select("select id,name from state where election = #{election}")
	public List<State> getAllState(int election);

	
	@Select("select id,name,link,state,party,person,code,parent,type,title,zone, x,y, "
			+ " (select count(*) from candidate c,item i  where c.item = i.id and c.person=a.person and i.type !='소속위원') + (select count(*) from item where person=a.person ) as history "
			+ " from item a where state=#{state}")
	public List<Item> getItem( @Param("state") int state);

	@Select("select id,person,item,link,party,txt,count,rate, "
			+ " (select count(*) from candidate c,item i  where c.item = i.id and c.person=a.person and i.type !='소속위원') + (select count(*) from item where person=a.person )  as history"
			+ " from candidate a where state=#{state}  order by id")
	public List<Candidate> getCandidate( @Param("state") int state);

	@Select("select id,item,party,count,type "
			+ " from council a where state=#{state}  order by id")
	public List<Council> getCouncil(int state);

	@Select("select c.id,c.person,c.item,c.link,c.party,c.txt,c.count,c.rate "
			+ " from candidate c,item i where c.item = i.id and (FIND_IN_SET(#{zone},zone) > 0 or FIND_IN_SET(zone,#{zone}) > 0 or zone=#{zone})  order by id")
	public List<Candidate> getZoneCandidate( @Param("zone") String zone);

	@Select("select c.id,c.item,c.party,c.count,c.type "
			+ " from council c, item i where c.item = i.id and (FIND_IN_SET(#{zone},zone) > 0 or FIND_IN_SET(zone,#{zone}) > 0 or zone=#{zone}) order by id")
	public List<Council> getZoneCouncil(String zone);

	
	@Select("select id,name,photo,txt from person")
	public List<Person> getPerson();

	
	
	
	@Select("select id,name,color,textColor from party")
	public List<Party> getParty();

	@Select("select id,name,code,pop from zone")	
	public List<Zone> getZone();

		
	@Select("select id,link, txt from sub where candidate = #{candidate}")
	public List<Sub> getSubs(int candidate);

	@Select("select concat(e.name,' ',s.name,' ',i.name,ifnull(i.title,'')) as txt, e.name as electionName, c.party, c.link, e.date,c.person, c.txt as result, rate, (select sum(rate) from candidate where item = c.item ) as total "
			+ "  from candidate c, item i, state s, election e"
			+ " where  c.item = i.id and i.election = e.id and i.state= s.id and c.person=#{person} and e.type='provincial' "
			+ " union select concat(e.name,' ',i.name) as txt, e.name as electionName, c.party, c.link,e.date,c.person, c.txt as result, rate, (select sum(rate) from candidate where item = c.item ) as total "
			+ "  from candidate c, item i, election e"
			+ " where  c.item = i.id and i.election = e.id and c.person=#{person} and e.type='by' "
			+ " union select e.name as txt,e.name as electionName,  i.party, i.link,e.date,i.person,i.type as result, code as rate, (select sum(code) from item where state = i.state ) as total "
			+ " from  item i, election e"
			+ " where    i.election = e.id and i.person=#{person} and e.type='presidential' ")
	public List<History> getHistory(int person);
	

//	@Select("select concat(e.name,' ',s.name,' ',i.name) as txt, c.party, c.link,e.date,c.person  from candidate c, item i, state s, election e, person p "
//			+ " where  p.id=c.person and c.item = i.id and i.election = e.id and i.state= s.id and (p.name=trim(#{name}) or p.id=#{name}) and e.type='provincial' "
//			+ " union select concat(e.name,' ',i.name) as txt, c.party, c.link,e.date ,c.person from candidate c, item i, election e, person p"
//			+ " where  p.id=c.person and  c.item = i.id and i.election = e.id and  (p.name=trim(#{name}) or p.id=#{name}) and e.type='by' "
//			+ " union select e.name as txt, i.party, i.link,e.date ,i.person from  item i, election e, person p"
//			+ " where  p.id=i.person and   i.election = e.id and  (p.name=trim(#{name}) or p.id=#{name}) and e.type='presidential' ")
	@Select("select concat(e.name,' ',s.name,' ',i.name,ifnull(i.title,'')) as txt, c.party, c.link,e.date,c.person, c.txt as result  from candidate c, item i, state s, election e, person p "
			+ " where  p.id=c.person and c.item = i.id and i.election = e.id and i.state= s.id and (p.name=trim(#{name}) ) and e.type='provincial' "
			+ " union select concat(e.name,' ',i.name) as txt, c.party, c.link,e.date ,c.person, c.txt as result from candidate c, item i, election e, person p"
			+ " where  p.id=c.person and  c.item = i.id and i.election = e.id and  (p.name=trim(#{name}) ) and e.type='by' "
			+ " union select e.name as txt, i.party, i.link,e.date ,i.person,'' as result from  item i, election e, person p"
			+ " where  p.id=i.person and   i.election = e.id and  (p.name=trim(#{name}) ) and e.type='presidential' ")
	public List<History> search(String name);
	
	@Select("select i.id,i.name as name,i.link,i.state,i.party,i.person,i.code,i.parent,i.type,i.title,i.zone,e.name as election "
			+ " from item i, state s, election e where i.state = s.id and s.election = e.id and (FIND_IN_SET(#{code},zone) > 0 or FIND_IN_SET(zone,#{code}) > 0 or zone=#{code})"
			+ "  order by e.date desc")
	public List<Item> getZoneHistory(String code);

	
	
	@Select("select cnt,person from ( " + 
			"select count(*) cnt,c.person from candidate c,state s, election e " + 
			"where c.state = s.id and s.election = e.id" + 
			"and (e.type='provincial' or e.type='by')" + 
			"group by person " + 
			")x order by cnt desc limit 10")
	public List<History> top10();
	
	@Select("select c.party,i.code, i.type, c.rate,c.person, concat(s.name,' ',i.name,ifnull(i.title,''),' ',p.name,' ',c.txt) as txt, i.x, i.y,"
			+ "  case when i.name ='' then s.name else i.name end  as name, " 
			+ " (select sum(rate)  from candidate where item=c.item) as total from candidate c, state s,item i,person p "
			+ " where c.state = s.id and c.item = i.id and p.id = c.person and s.election = #{election}  and c.rate > 0 and c.party>0 and c.party!=5")
	public List<Rate> getRates(int election);

	
	@Select("select c.party,i.code, i.type, c.count as rate,concat(s.name,' ',i.name) as txt, "
			+ " (select sum(count) from council where item=c.item and type='rate') as total from council c, state s,item i "
			+ " where c.state = s.id and c.item = i.id and s.election = #{election} and c.type='rate' and c.party>0 and c.party!=5")
	public List<Rate> getRRates(int election);

	
	@Select("select i.election, i.name as name, c.txt as txt , s.name as department, c.party, case when i.type='파이날' then c.link else i.link end as link , e.name as date,c.person, c.txt as result, i.type as type "
			+ "  from candidate c, item i, state s, election e "
			+ " where   c.item = i.id and i.election = e.id and i.state= s.id and c.person=#{person}  and e.type='inspection' and i.name!='소속위원'")
	public List<Inspection> getInspection(@Param("person") int person);

	@Update("update inspection set txt=#{txt}, link=#{link} ,  person=#{person}, department=#{department}, date=#{date} where id=#{id}")	
	public void editInspection(Inspection inspection);

	
	@Select("select id,person,txt,link,department,date from inspection order by date desc")
	public List<Inspection> getAllInspections();

	
	@Insert("insert into item (election,name,link,state,ord,party,person,code,parent,type) values (#{election},'','',#{id},0,0,0,'','','')")
	public void addItem(State state);

	@Update("update item set name=#{name},title=#{title}, link=#{link} , party=#{party}, person=#{person}, code=#{code}, parent=#{parent}, type=#{type}, zone=#{zone}, x=#{x}, y=#{y} where id=#{id}")
	public void editItem(Item item);

	@Insert("insert into candidate (item, person, party, link,ord,state,txt,count,rate) select #{id},max(id)+1,0,'',0,#{state},'',0,0 from person ")
	public void addCandidate(Item item);
	
	@Update("update candidate set person=#{person},party=#{party}, link=#{link}, txt=#{txt}, count=#{count},rate=#{rate} where id=#{id}")
	public void editCandidate(Candidate candidate);

	
	@Insert("insert into person (name) values (#{name})")
	public void addPerson(Person person);

	@Insert("insert into party (name,color,textColor) values (#{name},#{color},#{textColor})")
	public void addParty(Party party);
	
	@Insert("insert into zone (name,code) values (#{name},#{code})")	
	public void addZone(Zone zone);

	@Insert("insert into inspection (person,txt,link,department,date) values (0,#{txt},#{link},#{department},#{date})")
	public void addInspection(Inspection inspection);
	
	@Insert("insert into sub (candidate,link,txt) values (#{id},'','')")
	public void addSub(int id);

	@Update("update sub set link=#{link}, txt=#{txt} where id=#{id}")
	public void editSub(Sub sub);

	@Insert("insert into council (item,  party, ord,state,count,type) values ( #{id},0,0,#{state},0,'' ) ")
	public void addCouncil(Item item);

	@Update("update council set party=#{party},  count=#{count}, type=#{type} where id=#{id}")
	public void editCouncil(Council council);

	@Update("update person set photo = 1 where id = #{id}")
	public void photo(int id);





	



}
