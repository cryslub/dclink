package com.dclink.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.dclink.pojo.Candidate;
import com.dclink.pojo.CandidateInfo;
import com.dclink.pojo.Council;
import com.dclink.pojo.Election;
import com.dclink.pojo.History;
import com.dclink.pojo.Info;
import com.dclink.pojo.Inspection;
import com.dclink.pojo.Item;
import com.dclink.pojo.Party;
import com.dclink.pojo.Person;
import com.dclink.pojo.Promise;
import com.dclink.pojo.Rate;
import com.dclink.pojo.Result;
import com.dclink.pojo.State;
import com.dclink.pojo.Sub;
import com.dclink.pojo.Zone;

@Mapper
public interface MainMapper {
	@Select("select * from election order by date desc")
	public List<Election> getAllElection();

	@Select("select id,name from state where election = #{election}")
	public List<State> getState(int election);

	
	@Select("select * from state where id = #{id}")
	public State getStateById(int id);

	
//	@Select("select id,name,link,state,party,person,code,parent,type,title,zone, x,y, "
//			+ " (select count(*) from candidate c,item i  where c.item = i.id and c.person=a.person and i.type !='소속위원') + (select count(*) from item where person=a.person ) as history "
//			+ " from item a where state=#{state}")
	@Select("  select a.id,a.name,link,state,party,person,code,parent,type,title,zone, x,y, p.name as personName,p.photo,\r\n"
			+ "			(select count(*) from candidate c,item i  where c.item = i.id and c.person=a.person and i.type !='소속위원') + (select count(*) from item where person=a.person ) as history \r\n"
			+ "			 from item a\r\n"
			+ "			 left outer join person p  on a.person = p.id\r\n"
			+ "			 where state=#{state} ")
	public List<Item> getItem( @Param("state") int state);
	
	@Select("select * from item")
	public List<Item> getItems();

	@Select("select item.*,election.date from item "
			+ "join election on item.election = election.id "
			+ "where election.type = 'presidential' ")
	public List<Item> getPresidentialItems();

	
//	@Select("select id,person,item,link,party,txt,count,rate, "
//			+ " (select count(*) from candidate c,item i  where c.item = i.id and c.person=a.person and i.type !='소속위원') + (select count(*) from item where person=a.person )  as history"
//			+ " from candidate a where state=#{state}  order by id")
	@Select("   select a.id,a.person,a.item,a.link,a.party,a.txt,a.count,rate, p.name as personName,p.photo,\r\n"
			+ "		(select count(*) from candidate c,item i  where c.item = i.id and c.person=a.person and i.type !='소속위원') "
			+ "     + (select count(*) from item where person=a.person ) + (select count(*) from candidateInfo where person=a.person and candidateInfo.candidate!=a.id) as history, \r\n "
			+ "  	y.chinese,y.birth,y.address,y.job,y.education,y.career1,y.career2,y.gender "
			+ "		from candidate a\r\n"
			+ "		left outer join person p  on a.person = p.id \r\n"
			+ " 	left outer join candidateInfo y on a.id = y.candidate "
			+ "		where a.state=#{state} \r\n"
			+ "		order by a.id")
	public List<Candidate> getCandidate( @Param("state") int state);
	
	@Select("select * from candidate")
	public List<Candidate> getCandidates();
	

	@Select("select id,item,party,count,type "
			+ " from council a where state=#{state}  order by id")
	public List<Council> getCouncil(int state);

//	@Select("select c.id,c.person,c.item,c.link,c.party,c.txt,c.count,c.rate "
//			+ " from candidate c,item i where c.item = i.id and (FIND_IN_SET(#{zone},zone) > 0 or FIND_IN_SET(zone,#{zone}) > 0 or zone=#{zone})  order by id")
	@Select(" select c.id,c.person,c.item,c.link,c.party,c.txt,c.count,c.rate , p.name as personName,p.photo\r\n"
			+ "			from candidate c,item i ,person p\r\n"
			+ "			where c.item = i.id and (FIND_IN_SET(#{zone},zone) > 0 or FIND_IN_SET(zone,#{zone}) > 0 or zone=#{zone})  and c.person=p.id\r\n"
			+ "			order by id")
	public List<Candidate> getZoneCandidate( @Param("zone") String zone);

	@Select("select c.id,c.item,c.party,c.count,c.type "
			+ " from council c, item i where c.item = i.id and (FIND_IN_SET(#{zone},zone) > 0 or FIND_IN_SET(zone,#{zone}) > 0 or zone=#{zone}) order by id")
	public List<Council> getZoneCouncil(String zone);

	@Select("SELECT candidateInfo.item, item.election, candidateInfo.party,COUNT(*) AS count FROM candidateInfo\r\n"
			+ "INNER JOIN item ON candidateInfo.item = item.id AND((FIND_IN_SET(#{zone},zone) > 0 or FIND_IN_SET(zone,#{zone}) > 0 or zone=#{zone}))\r\n"
			+ "AND result = '당선' AND (candidateInfo.TYPE='6' OR candidateInfo.TYPE='9')\r\n"
			+ "GROUP BY candidateInfo.item, item.election, candidateInfo.party\r\n"
			+ "")
	public List<Council> getBasicZoneCouncil(String zone);
	
	@Select("SELECT metro.id as item, item.election, candidateInfo.party,COUNT(*) AS count\r\n"
			+ "from candidateInfo\r\n"
			+ "INNER JOIN item ON candidateInfo.item = item.id AND substring(zone,1,2)=#{zoone}\r\n"
			+ "INNER JOIN item metro ON metro.type='광역' AND metro.state = item.state\r\n"
			+ "AND result = '당선' AND (candidateInfo.TYPE='5' OR candidateInfo.TYPE='8')\r\n"
			+ "GROUP BY   metro.id, item.election, candidateInfo.party")
	public List<Council> getMetroZoneCouncil(String zone);
	
	@Select("SELECT  result.item,item.election,result.party,votes AS count\r\n"
			+ "from result\r\n"
			+ "INNER JOIN item ON result.item = item.id  AND((FIND_IN_SET(#{zone},zone) > 0 or FIND_IN_SET(zone,#{zone}) > 0 or zone=#{zone}))")
	public List<Council> getZoneRate(String zone);


	
	@Select("select * from person")
	public List<Person> getPerson();

	
	
	
	@Select("select id,name,color,textColor from party")
	public List<Party> getParty();

	@Select("select * from zone")	
	public List<Zone> getZone();

		
	@Select("select id,link, txt from sub where candidate = #{candidate}")
	public List<Sub> getSubs(int candidate);

//	@Select("select concat(e.name,' ',s.name,' ',i.name,ifnull(i.title,'')) as txt, e.name as electionName, c.party, c.link, e.date,c.person, c.txt as result, rate, (select sum(rate) from candidate where item = c.item ) as total "
//			+ "  from candidate c, item i, state s, election e"
//			+ " where  c.item = i.id and i.election = e.id and i.state= s.id and c.person=#{person} and e.type='provincial' "
//			+ " union select concat(e.name,' ',i.name) as txt, e.name as electionName, c.party, c.link,e.date,c.person, c.txt as result, rate, (select sum(rate) from candidate where item = c.item ) as total "
//			+ "  from candidate c, item i, election e"
//			+ " where  c.item = i.id and i.election = e.id and c.person=#{person} and e.type='by' "
//			+ " union select e.name as txt,e.name as electionName,  i.party, i.link,e.date,i.person,i.type as result, code as rate, (select sum(code) from item where state = i.state ) as total "
//			+ " from  item i, election e"
//			+ " where    i.election = e.id and i.person=#{person} and e.type='presidential' ")
	@Select("select x.* from(\r\n"
			+ "    \r\n"
			+ "  select   concat(s.name,' ',i.name,ifnull(i.title,'')) as txt,  e.id as election, e.name as electionName, c.party, c.link,e.date,c.person, c.txt as result  ,p.name as personName,p.photo,rate,\r\n"
			+ "					(select sum(rate) from candidate where item = c.item ) as total, \r\n"
			+ "			 y.chinese,y.partyName,y.birth,y.address,y.job,y.education,y.career1,y.career2,y.gender,y.ward,y.type\r\n"
			+ "			    	from candidate c\r\n"
			+ "					INNER join item i ON c.item = i.id\r\n"
			+ "					INNER join state s on i.state= s.id \r\n"
			+ "					inner join election e ON i.election = e.id and e.type='provincial'\r\n"
			+ "					inner join person p ON  p.id=c.person\r\n"
			+ "					left outer join candidateInfo y ON c.id = y.candidate\r\n"
			+ "					where   c.person=#{person}  "
			+ "	union \r\n"
			+ "		select   concat(i.name) as txt,e.id as election,e.name as electionName,  c.party, c.link,e.date ,c.person, c.txt as result  ,p.name as personName,p.photo,rate,\r\n"
			+ "		(select sum(rate) from candidate where item = c.item ) as total ,		\r\n"
			+ "			 y.chinese,y.partyName,y.birth,y.address,y.job,y.education,y.career1,y.career2,y.gender,y.ward,y.type\r\n"
			+ "			    	from candidate c\r\n"
			+ "					INNER join item i ON c.item = i.id\r\n"
			+ "					inner join election e ON i.election = e.id and e.type='by'\r\n"
			+ "					inner join person p ON  p.id=c.person\r\n"
			+ "					left outer join candidateInfo y ON c.id = y.candidate\r\n"
			+ "					where    c.person=#{person}  "
			+ "	union  select   '' as txt,e.id as election,e.name as electionName,  i.party, i.link,e.date ,i.person,i.type as result  ,p.name as personName,p.photo,code as rate,\r\n"
			+ "		(select sum(code) from item where state = i.state ) as total, \r\n"
			+ "			 y.chinese,y.partyName,y.birth,y.address,y.job,y.education,y.career1,y.career2,y.gender,y.ward,y.type\r\n"
			+ "			    	from  item i  "
			+ "					inner join election e ON i.election = e.id and e.type='presidential'\r\n"
			+ "					inner join person p ON  p.id=i.person\r\n"
			+ "					left outer join candidateInfo y ON i.id = y.item\r\n"
			+ "					where   i.person=#{person}  "
			+ " union "
			+ "  select concat(s.name,' ',i.name ) as txt,  e.id as election, e.name as electionName, y.party, '' as link,e.date,y.person, ifnull(y.result,replace(y.status,'등록','')) as result,p.name as personName,p.photo,votes as rate, "
			+ "					(select sum(votes) from candidateInfo where item = y.item and  ward = y.ward and type=y.type ) as total, \r\n"
			+ "			 y.chinese,y.partyName,y.birth,y.address,y.job,y.education,y.career1,y.career2,y.gender,y.ward,y.type\r\n"
			+ " from candidateInfo y "
			+ "					INNER join item i ON y.item = i.id\r\n"
			+ "					INNER join state s on i.state= s.id \r\n"
			+ "					inner join election e ON i.election = e.id and e.type='provincial'\r\n"
			+ "					inner join person p ON  p.id=y.person\r\n"
			+ "					where    y.person=#{person} and (y.type='5' or y.type='6' or y.type='8' or y.type='9' or y.type='10') "
			+ " union "
			+ "  select i.name as txt,  e.id as election, e.name as electionName, y.party, '' as link,e.date,y.person, ifnull(y.result,replace(y.status,'등록','')) as result,p.name as personName,p.photo,votes as rate, "
			+ "					(select sum(votes) from candidateInfo where item = y.item and  ward = y.ward and type=y.type ) as total, \r\n"
			+ "			 y.chinese,y.partyName,y.birth,y.address,y.job,y.education,y.career1,y.career2,y.gender,y.ward,y.type\r\n"
			+ " from candidateInfo y "
			+ "					INNER join item i ON y.item = i.id\r\n"
			+ "					inner join election e ON i.election = e.id and e.type='by'\r\n"
			+ "					inner join person p ON  p.id=y.person\r\n"
			+ "					where  y.person=#{person}  and (y.type='5' or y.type='6' or y.type='8' or y.type='9' or y.type='10') "

			+ "	)x"
			+ " order by date")
	public List<History> getHistory(int person);
	
	
	@Select(  "select x.* FROM( \r\n"
			+ "	select concat(s.name,' ',i.name ) as txt, e.id as election, e.name as electionName, y.party, '' as link,e.date,y.person, ifnull(y.result,replace(y.status,'등록','')) as result,\r\n"
			+ "	y.name as personName,y.votes as rate, (select SUM(votes) from candidateInfo where item = y.item and  ward = y.ward and type=y.type ) as total, \r\n"
			+ "	y.chinese,y.partyName,y.birth,y.address,y.job,y.education,y.career1,y.career2,y.gender,y.ward,y.type \r\n"
			+ "	from candidateInfo y \r\n"
			+ "	INNER JOIN  candidateInfo z ON z.id = #{id}\r\n"
			+ "	INNER join item i ON y.item = i.id \r\n"
			+ "	INNER join state s on i.state= s.id \r\n"
			+ "	inner join election e ON i.election = e.id and e.type='provincial'\r\n"
			+ "	 where y.chinese=z.chinese and y.birth=z.birth \r\n"
			+ "	 and (y.type='5' or y.type='6' or y.type='8' or y.type='9' or y.type='10')\r\n"
			+ "	 \r\n"
			+ "	 \r\n"
			+ "	  union select i.name as txt, e.id as election, e.name as electionName, y.party, '' as link,e.date,y.person, ifnull(y.result,\r\n"
			+ "	  replace(y.status,'등록','')) as result,y.name as personName,y.votes as rate, (select sum(votes) from candidateInfo where item = y.item and  ward = y.ward and type=y.type ) as total,\r\n"
			+ "	   y.chinese,y.partyName,y.birth,y.address,y.job,y.education,y.career1,y.career2,y.gender,y.ward,y.type \r\n"
			+ "	  from candidateInfo y \r\n"
			+ "	  	INNER JOIN  candidateInfo z ON z.id = #{id}\r\n"
			+ "	  INNER join item i ON y.item = i.id \r\n"
			+ "	  inner join election e ON i.election = e.id and e.type='by' \r\n"
			+ "	   where y.chinese=z.chinese and y.birth=z.birth \r\n"
			+ "		 and (y.type='5' or y.type='6' or y.type='8' or y.type='9' or y.type='10') )x order by DATE")
	public List<History> getInfoHistory(   String id );
	

//	@Select("select concat(e.name,' ',s.name,' ',i.name) as txt, c.party, c.link,e.date,c.person  from candidate c, item i, state s, election e, person p "
//			+ " where  p.id=c.person and c.item = i.id and i.election = e.id and i.state= s.id and (p.name=trim(#{name}) or p.id=#{name}) and e.type='provincial' "
//			+ " union select concat(e.name,' ',i.name) as txt, c.party, c.link,e.date ,c.person from candidate c, item i, election e, person p"
//			+ " where  p.id=c.person and  c.item = i.id and i.election = e.id and  (p.name=trim(#{name}) or p.id=#{name}) and e.type='by' "
//			+ " union select e.name as txt, i.party, i.link,e.date ,i.person from  item i, election e, person p"
//			+ " where  p.id=i.person and   i.election = e.id and  (p.name=trim(#{name}) or p.id=#{name}) and e.type='presidential' ")
//	@Select("select concat(e.name,' ',s.name,' ',i.name,ifnull(i.title,'')) as txt, c.party, c.link,e.date,c.person, c.txt as result  from candidate c, item i, state s, election e, person p "
//			+ " where  p.id=c.person and c.item = i.id and i.election = e.id and i.state= s.id and (p.name=trim(#{name}) ) and e.type='provincial' "
//			+ " union select concat(e.name,' ',i.name) as txt, c.party, c.link,e.date ,c.person, c.txt as result from candidate c, item i, election e, person p"
//			+ " where  p.id=c.person and  c.item = i.id and i.election = e.id and  (p.name=trim(#{name}) ) and e.type='by' "
//			+ " union select e.name as txt, i.party, i.link,e.date ,i.person,'' as result from  item i, election e, person p"
//			+ " where  p.id=i.person and   i.election = e.id and  (p.name=trim(#{name}) ) and e.type='presidential' ")
	@Select("select x.* from(\r\n"
			+ "    \r\n"
			+ "  select  concat(s.name,' ',i.name,ifnull(i.title,'')) as txt,  e.id as election, e.name as electionName, c.party, c.link,e.date,c.person, c.txt as result  ,p.name as personName,p.photo,rate,\r\n"
			+ "					(select sum(rate) from candidate where item = c.item ) as total, \r\n"
			+ "			 y.chinese,y.partyName,y.birth,y.address,y.job,y.education,y.career1,y.career2,y.gender,y.ward,y.type\r\n"
			+ "			    	from candidate c\r\n"
			+ "					INNER join item i ON c.item = i.id\r\n"
			+ "					INNER join state s on i.state= s.id \r\n"
			+ "					inner join election e ON i.election = e.id and e.type='provincial'\r\n"
			+ "					inner join person p ON  p.id=c.person\r\n"
			+ "					left outer join candidateInfo y ON c.id = y.candidate\r\n"
			+ "					where   p.name=TRIM(#{name})  "
			+ "	union \r\n"
			+ "		select  i.name as txt,e.id as election,e.name as electionName,  c.party, c.link,e.date ,c.person, c.txt as result  ,p.name as personName,p.photo,rate,\r\n"
			+ "		(select sum(rate) from candidate where item = c.item ) as total ,		\r\n"
			+ "			 y.chinese,y.partyName,y.birth,y.address,y.job,y.education,y.career1,y.career2,y.gender,y.ward,y.type\r\n"
			+ "			    	from candidate c\r\n"
			+ "					INNER join item i ON c.item = i.id\r\n"
			+ "					inner join election e ON i.election = e.id and e.type='by'\r\n"
			+ "					inner join person p ON  p.id=c.person\r\n"
			+ "					left outer join candidateInfo y ON c.id = y.candidate\r\n"
			+ "					where   p.name=TRIM(#{name})  "
			+ "	union   "
			+ "    select '' as txt, e.id as election,e.name as electionName,  i.party, i.link,e.date ,i.person,i.type as result  ,p.name as personName,p.photo,code as rate,\r\n"
			+ "		(select sum(code) from item where state = i.state ) as total, \r\n"
			+ "			 y.chinese,y.partyName,y.birth,y.address,y.job,y.education,y.career1,y.career2,y.gender,y.ward,y.type\r\n"
			+ "			    	from  item i  "
			+ "					inner join election e ON i.election = e.id and e.type='presidential'\r\n"
			+ "					inner join person p ON  p.id=i.person\r\n"
			+ "					left outer join candidateInfo y ON i.id = y.item\r\n"
			+ "					where   p.name=TRIM(#{name})  "
			+ " union "
			+ "  select concat(s.name,' ',i.name ) as txt,  e.id as election, e.name as electionName, y.party, '' as link,e.date,y.person, ifnull(y.result,replace(y.status,'등록','')) as result,p.name as personName,p.photo,votes as rate, "
			+ "					(select sum(votes) from candidateInfo where item = y.item and type=y.type ) as total, \r\n"
			+ "			 y.chinese,y.partyName,y.birth,y.address,y.job,y.education,y.career1,y.career2,y.gender,y.ward,y.type\r\n"
			+ " from candidateInfo y "
			+ "					INNER join item i ON y.item = i.id\r\n"
			+ "					INNER join state s on i.state= s.id \r\n"
			+ "					inner join election e ON i.election = e.id and e.type='provincial'\r\n"
			+ "					inner join person p ON  p.id=y.person\r\n"
			+ "					where   p.name=TRIM(#{name}) and (y.type='5' or y.type='6' or y.type='8' or y.type='9' or y.type='10') "
			+ " union "
			+ "  select i.name as txt,  e.id as election, e.name as electionName, y.party, '' as link,e.date,y.person, ifnull(y.result,replace(y.status,'등록','')) as result,p.name as personName,p.photo,votes as rate, "
			+ "					(select sum(votes) from candidateInfo where item = y.item and type=y.type ) as total, \r\n"
			+ "			 y.chinese,y.partyName,y.birth,y.address,y.job,y.education,y.career1,y.career2,y.gender,y.ward,y.type\r\n"
			+ " from candidateInfo y "
			+ "					INNER join item i ON y.item = i.id\r\n"
			+ "					inner join election e ON i.election = e.id and e.type='by'\r\n"
			+ "					inner join person p ON  p.id=y.person\r\n"
			+ "					where   p.name=TRIM(#{name}) and (y.type='5' or y.type='6' or y.type='8' or y.type='9' or y.type='10') "
			+ "	)x"
			+ " order by date")
	public List<History> search(String name);
	
	@Select(" select candidateInfo.*,election.name as electionName, state.name as stateName, result.result,item.name as itemName from candidateInfo \r\n"
			+ " INNER JOIN election ON candidateInfo.date = election.date \r\n"
			+ " LEFT outer JOIN state ON state.election = election.id \r\n"
			+ " LEFT outer join item on candidateInfo.item = item.id and item.state = state.id \r\n"
			+ " LEFT OUTER join zone ON zone.fullName = candidateInfo.state AND zone.name = state.name\r\n"
			+ " left outer join result on candidateInfo.date = result.date and candidateInfo.type = result.type and candidateInfo.ward = result.ward and candidateInfo.partyName = result.partyName and candidateInfo.name = result.candidateName \r\n"
			+ " where\r\n"
			+ "  (zone.id IS NOT NULL OR (election.type='by' AND candidateInfo.type!='8')) \r\n"
			+ "	AND (item.id IS NOT NULL OR(candidateInfo.type='8'))\r\n"
			+ "  AND (candidateInfo.type='5' or candidateInfo.type='6' or candidateInfo.type='8' or candidateInfo.type='9' or candidateInfo.type='10') and candidateInfo.name=TRIM(#{name}) "
			+ " and candidateInfo.person is null  "
			+ " order by candidateInfo.date \r\n"
			+ " ")
	public List<CandidateInfo> searchInfo(String name);
	
//	@Select("select i.id,i.name as name,i.link,i.state,i.party,i.person,i.code,i.parent,i.type,i.title,i.zone,e.name as election "
//			+ " from item i, state s, election e where i.state = s.id and s.election = e.id and (FIND_IN_SET(#{code},zone) > 0 or FIND_IN_SET(zone,#{code}) > 0 or zone=#{code})"
//			+ "  order by e.date desc")
	@Select("  select i.id,i.name as name,i.link,i.state,i.party,i.person,i.code,i.parent,i.type,i.title,i.zone,e.name as election, e.result as result \r\n"
			+ "			 from item i, state s, election e \r\n"
			+ "			 where i.state = s.id and s.election = e.id and (FIND_IN_SET(#{zone},zone) > 0 or FIND_IN_SET(zone,#{zone}) > 0 or zone=#{zone})\r\n"
			+ "			  order by e.date desc")
	public List<Item> getZoneHistory(String code);

	
	
	@Select("select cnt,person from ( " + 
			"select count(*) cnt,c.person from candidate c,state s, election e " + 
			"where c.state = s.id and s.election = e.id" + 
			"and (e.type='provincial' or e.type='by')" + 
			"group by person " + 
			")x order by cnt desc limit 10")
	public List<History> top10();
	
//	@Select("select c.party,i.code, i.type, c.rate,c.person, concat(s.name,' ',i.name,ifnull(i.title,''),' ',p.name,' ',c.txt) as txt, i.x, i.y,"
//			+ "  case when i.name ='' then s.name else i.name end  as name, " 
//			+ " (select sum(rate)  from candidate where item=c.item) as total from candidate c, state s,item i,person p "
//			+ " where c.state = s.id and c.item = i.id and p.id = c.person and s.election = #{election}  and c.rate > 0 and c.party>0 and c.party!=5")
	@Select("	select c.party,i.code, i.type, c.rate,c.person, concat(s.name,' ',i.name) as region,\r\n"
			+ "  			concat(s.name,' ',i.name,ifnull(i.title,''),' ',p.name,' ',c.txt) as txt, i.x, i.y,p.photo,p.name as personName,\r\n"
			+ "			  case when i.name ='' then s.name else i.name end  as name,  \r\n"
			+ "			 (select sum(rate)  from candidate where item=c.item) as totalRate,0 as total  ,i.id as item\r\n"
			+ "			 from (\r\n"
			+ "			 	select * from candidate where rate>0 and party>0\r\n"
			+ "			 )c\r\n"
			+ "			 join( \r\n"
			+ "			 	select * from state 	where  election = #{election} 	\r\n"
			+ "			) s  on c.state = s.id \r\n"
			+ "			 join (\r\n"
			+ "			 	select * from item  where  election = #{election}\r\n"
			+ "			 ) i on c.item = i.id\r\n"
			+ "			 join person p on p.id = c.person ")
	public List<Rate> getRates(int election);

	
//	@Select("select c.party,i.code, i.type, c.count as rate,concat(s.name,' ',i.name) as txt, "
//			+ " (select sum(count) from council where item=c.item and type='rate') as total from council c, state s,item i "
//			+ " where c.state = s.id and c.item = i.id and s.election = #{election} and c.type='rate' and c.party>0 and c.party!=5")
	@Select("select c.party,i.code, i.type, c.rate,c.person, concat(s.name,' ',i.name) as region,\r\n"
			+ "  			concat(s.name,' ',i.name,ifnull(i.title,''),' ',p.name,' ',c.txt) as txt, i.x, i.y,p.photo,p.name as personName,\r\n"
			+ "			  case when i.name ='' then s.name else i.name end  as name,  \r\n"
			+ "			 (select sum(count) from council where item=c.item and type='rate') as totalRate, 0 as total ,i.id as item\r\n"
			+ "			 from (\r\n"
			+ "			 	select * from candidate where rate>0 and party>0\r\n"
			+ "			 )c\r\n"
			+ "			 join( \r\n"
			+ "			 	select * from state 	where  election = #{election} 	\r\n"
			+ "			) s  on c.state = s.id \r\n"
			+ "			 join (\r\n"
			+ "			 	select * from item  where  election = #{election}\r\n"
			+ "			 ) i on c.item = i.id\r\n"
			+ "			 join person p on p.id = c.person ")
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

	@Select("select * from state")
	public List<State> getAllState();
	 
	@Select("select * from partySub")
	public List<Sub> getPartySubs();

	@Select("	select s.id,s.link, s.txt , c.id as candidate"
			+ "		from sub s,candidate c "
			+ "		where s.candidate = c.id and c.state = #{state}")
	public List<Sub> getStateSubs(Integer state);

	@Select(" select a.id,a.name,link,state,party,person,code,parent,type,title,zone, x,y, p.name as personName,p.photo,\r\n"
			+ "			(select count(*) from candidate c,item i  where c.item = i.id and c.person=a.person and i.type !='소속위원') + (select count(*) from item where person=a.person ) as history \r\n"
			+ "			 from item a\r\n"
			+ "			 left outer join person p  on a.person = p.id\r\n"
			+ "			 where election=#{election}")
	public List<Item> getElectionItem(Integer election);

	@Select("select c.party,i.code, i.type, c.count as rate,concat(s.name,' ',i.name) as txt, \r\n"
			+ "		(select sum(count) from council where item=c.item and type='rate') as totalRate \r\n"
			+ "		from council c\r\n"
			+ "		join state s\r\n"
			+ "		join item i \r\n"
			+ "		where c.state = s.id and c.item = i.id and s.election = #{election} and c.type='rate' and c.party>0 and c.party!=5")
	public List<Rate> getProportion(int election);

	@Insert("insert into info (category,date, type, json) values (#{category},#{date},#{type},#{json})")
	public void addInfo(Info info);

	
	@Insert("insert into candidateInfo (candidate,date,type,necId,ward,state,district,number,partyName,name,gender,chinese,birth,age,address,job,education,career1,career2,status) values "
			+ "(0,#{SG_ID},#{SG_TYPECODE},#{HUBOID},#{SGG_NAME},#{SD_NAME},#{WIW_NAME},#{GIHO},#{JD_NAME},#{NAME},#{GENDER},#{HANJA_NAME},#{BIRTHDAY},#{AGE},#{ADDR},#{JOB},#{EDU},#{CAREER1},#{CAREER2},#{STATUS})")
	public void addCandidateInfo(Map<String,Object> info);
	
	@Select("select candidateInfo.*,candidateInfo.name as personName ,candidateInfo.result as txt, candidateInfo.votes as rate"
			+ " "
			+ " from candidateInfo "
			+ " inner join state on  state.id = #{state} "
			+ " inner join election on election.id = state.election and election.date = candidateInfo.date "
			+ " left outer join zone on zone.fullName = candidateInfo.state and zone.name = state.name "
			+ " LEFT OUTER JOIN result ON result.date = candidateInfo.date and result.type = candidateInfo.type and result.state = candidateInfo.state and result.ward = candidateInfo.ward AND result.party = candidateInfo.party\r\n"
			+ " where candidateInfo.type = #{type} "
			+ "	and ( zone.id is not null or state.name ='')  "
			+ " ORDER BY  ifnull(result.id,999999), length(candidateInfo.ward), candidateInfo.ward " )
	public List<CandidateInfo> getCandidateInfo(@Param("state") int state, @Param("type") String type);

	
	
	@Select("select promise.*,candidateInfo.candidate from promise"
			+ " inner join candidateInfo on candidateInfo.necId = promise.necId "
			+ " inner join state on  state.id = #{state} "
			+ " inner join election on election.id = state.election and election.date = candidateInfo.date "
			+ " left outer join zone on zone.fullName = candidateInfo.state and zone.name = state.name "
			+ "	where ( zone.id is not null or state.name ='')  " )
public List<Promise> getPromise(@Param("state") int state);
	

	@Insert("insert into promise (necId,title,content) values "
			+ "(#{necId},#{title},#{content})")
	public void addPromise(Promise promise);

	
	@Select("select result.*,result.partyName as personName,'낙선' as txt, result.votes as rate"
			+ " from result"
			+ " inner join state on  state.id = #{state} "
			+ " inner join election on election.id = state.election and election.date = result.date "
			+ " left outer join zone on zone.fullName = result.state and zone.name = state.name "
			+ " where result.type = #{type} "
			+ "	and ( zone.id is not null )  "
			+ " order by id " )
	public List<CandidateInfo> getResult(@Param("state") int state, @Param("type") String type);

	
	@Select("select * from candidateInfo where necId=#{necId} " )
	public CandidateInfo getCandidateInfoByNecId(String necId);

	
	@Select("select candidateInfo.* from candidateInfo where date = (select date from election where id=#{election}) and type='2' and candidate=0 " )
	public List<CandidateInfo> getCandidateInfoByElection(int election);
	
	
	
	@Update("UPDATE candidateInfo\r\n"
			+ "		INNER JOIN person ON candidateInfo.name = person.name\r\n"
			+ "		INNER JOIN election ON candidateInfo.date = election.date AND election.id = #{election}\r\n"
			+ "		INNER JOIN state ON  state.election = #{election}\r\n"
			+ "		INNER JOIN item ON item.person = person.id AND item.state = state.id\r\n"
			+ "		SET candidateInfo.item = item.id \r\n"
			+ "		WHERE candidateInfo.type = '1'")
	public void matchPresident(int election);
	
	@Update("UPDATE candidateInfo\r\n"
			+ "			INNER JOIN person ON candidateInfo.name = person.name\r\n"
			+ "			INNER JOIN party ON candidateInfo.partyName = party.name\r\n"
			+ "			INNER JOIN election ON candidateInfo.date = election.date AND election.id =  #{election} \r\n"
			+ "			INNER JOIN state ON  (candidateInfo.state = state.fullName or state.fullName is null) and state.election =  #{election} \r\n"
			+ "		INNER JOIN item ON candidateInfo.district LIKE CONCAT('%', SUBSTRING_INDEX(SUBSTRING_INDEX(item.name, ' ', 23), ' ', -1), '%') \r\n"
			+ "			INNER JOIN candidate ON candidate.person = person.id \r\n"
			+ "			AND candidate.state = state.id\r\n"
			+ "			AND state.election = election.id\r\n"
			+ "			AND candidate.party = party.id\r\n"
			+ "			AND candidate.person = person.id\r\n"
			+ "			SET candidateInfo.candidate = candidate.id \r\n"
			+ "			WHERE candidateInfo.type = '2'")
	public void matchCongress2(int election);
	
	@Update("update candidateInfo\r\n"
			+ "INNER JOIN person ON candidateInfo.name = person.name\r\n"
			+ "						INNER JOIN party ON candidateInfo.partyName = party.name\r\n"
			+ "						INNER JOIN election ON candidateInfo.date = election.date AND election.date=#{date}\r\n"
			+ "						INNER JOIN state ON  (candidateInfo.state = state.fullName or state.fullName is null) and state.election = election.id\r\n"
			+ "					INNER JOIN item ON item.state = state.id and item.name like concat('%',#{ward},'%') \r\n"
			+ "						INNER JOIN candidate ON candidate.person = person.id \r\n"
			+ "						AND candidate.state = state.id\r\n"
			+ "						AND candidate.party = party.id\r\n"
			+ "						AND candidate.person = person.id\r\n"
			+ "						SET candidateInfo.candidate = candidate.id\r\n"
			+ "						WHERE candidateInfo.id = #{id}\r\n")
	public void matchCongress(CandidateInfo candidateInfo);
	
	@Update("update candidateInfo\r\n"
			+ "INNER JOIN person ON candidateInfo.name = person.name\r\n"
			+ "						INNER JOIN party ON candidateInfo.partyName = party.name\r\n"
			+ "						INNER JOIN election ON candidateInfo.date = election.date AND election.id =   #{election}\r\n"
			+ "						INNER JOIN state ON  state.name='비례'  and state.election =  #{election}\r\n"
			+ "					INNER JOIN item ON item.state = state.id and item.party = party.id \r\n"
			+ "						INNER JOIN candidate ON candidate.person = person.id \r\n"
			+ "						AND candidate.state = state.id\r\n"
			+ "						AND candidate.party = party.id\r\n"
			+ "						AND candidate.person = person.id\r\n"
			+ "						SET candidateInfo.candidate = candidate.id\r\n"
			+ "						WHERE candidateInfo.type='7' and candidateInfo.candidate=0 \r\n")
	public void matchProportional(int election);
	
	@Update("UPDATE candidateInfo\r\n"
			+ "INNER JOIN person ON candidateInfo.name = person.name\r\n"
			+ "INNER JOIN party ON candidateInfo.partyName = party.name\r\n"
			+ "INNER JOIN election ON candidateInfo.date = election.date  AND election.id = #{election}\r\n"
			+ "INNER JOIN state ON (candidateInfo.state = state.fullName or state.fullName is null)  AND state.election = #{election} \r\n"
			+ "INNER JOIN item ON item.type = '광역'\r\n"
			+ "INNER JOIN candidate ON candidate.item = item.id\r\n"
			+ "AND candidate.state = state.id\r\n"
			+ "AND state.election = election.id\r\n"
			+ "AND candidate.party = party.id\r\n"
			+ "AND candidate.person = person.id\r\n"
			+ "SET candidateInfo.candidate = candidate.id, "
			+ " candidateInfo.person = person.id "
			+ "WHERE candidateInfo.type = '3'  and candidateInfo.candidate=0  ")
	public void matchMetro(int election);

	
	@Update("UPDATE candidateInfo\r\n"
			+ "INNER JOIN person ON candidateInfo.name = person.name\r\n"
			+ "INNER JOIN party ON candidateInfo.partyName = party.name\r\n"
			+ "INNER JOIN election ON candidateInfo.date = election.date  AND election.id = #{election}\r\n"
			+ "INNER JOIN state ON   (candidateInfo.state = state.fullName or state.fullName is null)   AND state.election = #{election} \r\n"
			+ "INNER JOIN item ON candidateInfo.district LIKE CONCAT('%', SUBSTRING_INDEX(SUBSTRING_INDEX(item.name, ' ', 23), ' ', -1), '%') AND item.type = '기초' \r\n"
			+ "INNER JOIN candidate ON candidate.item = item.id\r\n"
			+ "AND candidate.state = state.id\r\n"
			+ "AND state.election = election.id\r\n"
			+ "AND candidate.party = party.id\r\n"
			+ "AND candidate.person = person.id\r\n"
			+ "SET candidateInfo.candidate = candidate.id,"
			+ " candidateInfo.person = person.id   "
			+ "WHERE candidateInfo.type = '4'  and candidateInfo.candidate=0  ")
	public void matchBasic(int election);

	@Update("UPDATE candidateInfo\r\n"
			+ "INNER JOIN person ON candidateInfo.name = person.name\r\n"
			+ "INNER JOIN election ON candidateInfo.date = election.date  AND election.id = #{election}\r\n"
			+ "INNER JOIN state ON  (candidateInfo.state = state.fullName or state.fullName is null)   AND state.election = #{election} \r\n"
			+ "INNER JOIN item ON item.state = state.id AND item.title='교육감'\r\n"
			+ "INNER JOIN candidate ON candidate.item = item.id\r\n"
			+ "AND candidate.state = state.id\r\n"
			+ "AND state.election = election.id\r\n"
			+ "AND candidate.party = ''\r\n"
			+ "AND candidate.person = person.id\r\n"
			+ "SET candidateInfo.candidate = candidate.id, \r\n"
			+ " candidateInfo.person = person.id  "
			+ "WHERE candidateInfo.type = '11'  and candidateInfo.candidate=0  ")
	public void matchEdu(int election);
	
	@Update("	UPDATE candidateInfo	\r\n"
			+ "			INNER JOIN (SELECT MAX(id)AS id ,name FROM party GROUP BY NAME) p ON p.name = candidateInfo.partyName\r\n"
			+ "			INNER JOIN election ON candidateInfo.date = election.date AND election.id =  #{election}\r\n"
			+ "			SET candidateInfo.party = p.id  "
			+ "     where candidateInfo.party is null ")
	public void matchParty(int election);
	
	@Update("	update candidateInfo			\r\n"
			+ "	INNER JOIN election ON candidateInfo.date = election.date  AND election.id =  #{election} AND election.type!='by'\r\n"
			+ "			INNER JOIN state ON  (candidateInfo.state = state.fullName or state.fullName is null)  AND state.election = #{election}\r\n"
			+ "			INNER JOIN item ON item.state = state.id AND candidateInfo.district LIKE concat( SUBSTRING_INDEX(SUBSTRING_INDEX(item.name, ' ', 2), ' ', -1),'%') AND item.name != ''\r\n"
			+ "			inner join 	zone on zone.fullName = candidateInfo.state and zone.name = state.name \r\n"
			+ "			SET candidateInfo.item = item.id "
			+ "   where candidateInfo.item is null  ")
	public void matchItem(int election);

	@Update("	update candidateInfo			\r\n"
			+ "	INNER JOIN election ON candidateInfo.date = election.date  AND election.id =  #{election} AND election.type='by'\r\n"
			+ "			INNER JOIN state ON  (candidateInfo.state = state.fullName or state.fullName is null)  AND state.election = #{election}\r\n"
			+ "			INNER JOIN item ON item.state = state.id "
			+ "				AND candidateInfo.district LIKE concat( SUBSTRING_INDEX(SUBSTRING_INDEX(item.name, ' ', 2), ' ', -1),'%') AND item.name != ''\r\n"
			+ "			inner join 	zone on zone.fullName = candidateInfo.state and zone.name = SUBSTRING_INDEX(SUBSTRING_INDEX(item.name, ' ', 1), ' ', -1) \r\n"
			+ "			SET candidateInfo.item = item.id "
			+ "   where candidateInfo.item is null  ")
	public void matchByItem(int election);

	
	@Update("UPDATE candidateInfo\r\n"
			+ "INNER JOIN election ON candidateInfo.date = election.date AND election.type='provincial' AND election.id = #{election}\r\n"
			+ " inner join zone on zone.fullName = candidateInfo.state "
			+ "INNER JOIN state ON state.name = zone.name and state.election = #{election}\r\n"
			+ "INNER JOIN item ON item.state = state.id AND item.type='광역'\r\n"
			+ "SET candidateInfo.item = item.id\r\n"
			+ "WHERE candidateInfo.type = '8'  and candidateInfo.item  is null ")
	public void matchMetroItem(int election);

	
	@Insert("insert into result (date,type,ward,state,partyName,candidateName,result) values "
			+ "(#{SG_ID},#{SG_TYPECODE},#{SGG_NAME},#{SD_NAME},#{JD_NAME},#{NAME},'낙선')")
	public void addResult(Map<String,Object> info);

	
	@Insert("insert into result (date,type,ward,partyName,candidateName,votes,result,state) values "
			+ "(#{date},#{type},#{ward},#{partyName},#{candidateName},#{votes},'낙선',#{state})")
	public void insertResult(Result result);
	
	@Update("update candidateInfo set votes=#{votes}, result='낙선'"
			+ " where date=#{date} "
			+ " and type=#{type} "
			+ " and ward=#{ward} "
			+ " and partyName=#{partyName} "
			+ " and name=#{candidateName} ")
	public void updateVotes(Result result);

	@Update("update candidate "
			+ " INNER JOIN candidateInfo ON candidateInfo.candidate = candidate.id\r\n"
			+ " set candidate.rate=#{votes}, candidate.txt='낙선'"
			+ " where candidateInfo.date=#{date} "
			+ " and candidateInfo.type=#{type} "
			+ " and candidateInfo.ward=#{ward} "
			+ " and candidateInfo.partyName=#{partyName} "
			+ " and candidateInfo.name=#{candidateName} ")
	public void updateCandidateVotes(Result result);

	
	@Update("update candidateInfo "
			+ "set result = '당선' "
			+ " where date=#{SG_ID} "
			+ " and type=#{SG_TYPECODE} "
			+ " and ward=#{SGG_NAME} "
			+ " and partyName=#{JD_NAME} "
			+ " and name=#{NAME} ")
	public void setElected(Map<String,Object> result);

	@Update("update candidate "
			+ " INNER JOIN candidateInfo ON candidateInfo.candidate = candidate.id\r\n"
			+ "set candidate.txt = '당선' "
			+ " where candidateInfo.date=#{SG_ID} "
			+ " and candidateInfo.type=#{SG_TYPECODE} "
			+ " and candidateInfo.ward=#{SGG_NAME} "
			+ " and candidateInfo.partyName=#{JD_NAME} "
			+ " and candidateInfo.name=#{NAME} ")
	public void setCandidateElected(Map<String,Object> result);

	

	@Update("	UPDATE result	\r\n"
			+ "			INNER JOIN (SELECT MAX(id)AS id ,name FROM party GROUP BY NAME) p ON p.name = result.partyName\r\n"
			+ "			INNER JOIN election ON result.date = election.date AND election.id =  #{election}\r\n"
			+ "			SET result.party = p.id  "
			+ "     where result.party is null ")
	public void matchResult(int election);

	
	@Update("	update result			\r\n"
			+ "	INNER JOIN election ON result.date = election.date  AND election.id =  #{election}\r\n"
			+ "			INNER JOIN state ON  state.election = #{election}\r\n"
			+ "			INNER JOIN item ON item.state = state.id "
			+ "				AND result.ward LIKE concat( item.name,'%') AND item.name != '' and item.type='기초' \r\n"
			+ "			inner join 	zone on zone.fullName = result.state and zone.name = state.name \r\n"
			+ "			SET result.item = item.id "
			+ "   where result.item is null  ")
	public void matchResultItem(int election);
	
	@Update("	update result			\r\n"
			+ "INNER JOIN election ON result.date = election.date  AND election.id =  #{election}\r\n"
			+ "		INNER JOIN state ON  state.election = #{election}\r\n"
			+ "		INNER JOIN item ON item.state = state.id  and item.type='광역' \r\n"
			+ "		inner join 	zone on zone.fullName = result.state and zone.name = state.name \r\n"
			+ "		SET result.item = item.id \r\n"
			+ "where result.item is NULL  \r\n"
			+ " ")
	public void matchMetroResultItem(int election);
	
	
	@Update("UPDATE person\r\n"
			+ "INNER JOIN candidate ON candidate.person = person.id\r\n"
			+ "INNER JOIN candidateInfo ON candidateInfo.candidate = candidate.id\r\n"
			+ "INNER JOIN state ON candidate.state = state.id AND state.election = #{election}\r\n"
			+ "SET person.chinese = candidateInfo.chinese, person.birth = candidateInfo.birth\r\n"
			+ "WHERE person.chinese IS null")
	public void matchPerson(int election);

	@Update("UPDATE person\r\n"
			+ "INNER JOIN item ON item.person = person.id and item.election= #{election}\r\n"
			+ "INNER JOIN candidateInfo ON candidateInfo.item = item.id\r\n"
			+ "SET person.chinese = candidateInfo.chinese, person.birth = candidateInfo.birth\r\n"
			+ "WHERE person.chinese IS null")
	public void matchPresidentialPerson(int election);

	
	@Update("update candidateInfo\r\n"
			+ "INNER JOIN person ON candidateInfo.chinese = person.chinese AND candidateInfo.birth = person.birth\r\n"
			+ "SET candidateInfo.person = person.id\r\n"
			+ "WHERE candidateInfo.person IS null "
			+ " AND (candidateInfo.type='5' OR candidateInfo.type='6' OR candidateInfo.type='8' OR candidateInfo.type='9' OR candidateInfo.type='10') \r\n")
	public void matchCandidateInfoPerson(int election);
	

	@Insert("INSERT INTO result\r\n"
			+ "(date,type,ward,partyName,candidateName,result)\r\n"
			+ "SELECT candidateInfo.date,candidateInfo.type,candidateInfo.ward,candidateInfo.partyName,candidateInfo.name,'당선' FROM candidateInfo\r\n"
			+ "INNER JOIN election ON candidateInfo.date = election.date  and election.result='true' AND election.id = #{election}\r\n"
			+ "LEFT OUTER JOIN result ON candidateInfo.date  =  result.date and candidateInfo.type  =  result.type and candidateInfo.ward  =  result.ward and candidateInfo.partyName  =  result.partyName and candidateInfo.name  =  result.candidateName \r\n"
			+ "WHERE result.id IS NULL\r\n"
			+ "AND (candidateInfo.type='5' or candidateInfo.type='6')\r\n"
			+ "AND candidateInfo.status = '등록'")
	public void amendResult(int election);
	
	@Update(" UPDATE  candidateInfo\r\n"
			+ "JOIN (\r\n"
			+ "SELECT chinese,birth, COUNT(*) as cnt FROM candidateInfo\r\n"
			+ "WHERE (type='5' OR type='6' OR type='8' OR type='9' OR type='10')\r\n"
			+ "GROUP BY chinese,birth\r\n"
			+ ") x ON x.chinese=candidateInfo.chinese AND x.birth = candidateInfo.birth \r\n"
			+ "SET HISTORY = x.cnt +  (select count(*) from candidate c,item i  where c.item = i.id and c.person=candidateInfo.person and i.type !='소속위원')  + (select count(*) from item where person=candidateInfo.person )\r\n"
			+ "WHERE (type='5' OR type='6' OR type='8' OR type='9' OR type='10')\r\n"
			+ "AND (HISTORY <=1 OR HISTORY IS NULL)\r\n"
			+ "")
	public void matchCandidateInfoHistory1();

	@Select("select * from candidateInfo")
	public List<CandidateInfo> getCandidateInfos();

	@Select("select * from promise")
	public List<Promise> getPromises();
	
	@Select("select * from result")
	public List<CandidateInfo> getResults();

	@Select("select * from sub")
	public List<Sub> getSubsAll();
	
	
	
}
