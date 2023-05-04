import CardContent from './CardContent';
import { Stack, Box } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import YoutubeLink from 'ui-component/YoutubeLink';
import ProvincialTitle from './provincial/ProvincialTitle';
import PresidentialTitle from './presidential/PresidentialTitle';
import ProportionalTitle from './proportional/ProportionalTitle';

const ElectionCard = (prop) => {
    const item = prop.item;
    const election = prop.election;
    const state = prop.state;

    //    const content = item.type == '광역' || item.type == '기초' || item.type == '국회' || item.title == '교육감' || item.name == '교육감';
    let content = item.content ? item.content : true;
    if (item.name == 'Overview' || item.name == '기본사항') content = false;

    let Title = ProvincialTitle;
    if (election.type == 'presidential') Title = PresidentialTitle;
    if (state.name == '비례') Title = ProportionalTitle;

    return (
        <Box mb={2} key={item._id}>
            <MainCard
                title={<Title item={item} />}
                content={content}
                secondary={
                    <Stack alignItems="center" direction="row" spacing={1}>
                        {item.link ? <YoutubeLink link={item.link} /> : null}
                    </Stack>
                }
                contentSX={{ paddingTop: 0 }}
            >
                {content && <CardContent item={item} election={election} state={state} />}
            </MainCard>
        </Box>
    );
};

export default ElectionCard;
