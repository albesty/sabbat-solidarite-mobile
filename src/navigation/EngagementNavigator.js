import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import routes from './routes';
import EngagementVoteListScreen from '../screens/engagement/EngagementVoteListScreen';
import EtatEngagementScreen from '../screens/engagement/EtatEngagementScreen';
import MemberEngagementScreen from '../screens/engagement/MemberEngagementScreen';
import HeaderButton from '../components/navigation/HeaderButton';
import { colors } from '../utils/styles';
import NavigationTitle from '../components/navigation/NavigationTitle';
import NewEngementScreen from '../screens/engagement/NewEngementScreen';
import TrancheItemScreen from '../screens/engagement/TrancheItemScreen';
import EngagementVotantScreen from '../screens/engagement/EngagementVotantScreen';

const EngageStack = createStackNavigator();
export default function EngagementNavigator() {
  return (
    <EngageStack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerStyle: { backgroundColor: colors.rougeBordeau },
        headerTintColor: colors.white,
        headerLeft: () =>
          route.name !== routes.ETAT_ENGAGEMENT ? (
            <HeaderButton onPress={() => navigation.goBack()} />
          ) : null,
        ...TransitionPresets.SlideFromRightIOS,
      })}
    >
      <EngageStack.Screen
        name={routes.ETAT_ENGAGEMENT}
        component={EtatEngagementScreen}
        options={{
          headerTitle: () => <NavigationTitle title="Etat des engagements" />,
        }}
      />
      <EngageStack.Screen
        name={routes.VOTE_ENGAGEMENT}
        component={EngagementVoteListScreen}
        options={{
          headerTitle: () => <NavigationTitle title="Voting des engagements" />,
        }}
      />
      <EngageStack.Screen
        name={routes.MEMBER_ENGAGEMENT}
        component={MemberEngagementScreen}
        options={({ route }) => ({
          headerTitle: () => (
            <NavigationTitle
              title={`${route.params.username ? route.params.username : route.params.email}`}
            />
          ),
        })}
      />
      <EngageStack.Screen
        name={routes.NEW_ENGAGEMENT}
        component={NewEngementScreen}
        options={{
          headerTitle: () => <NavigationTitle title="Nouvel engagement" />,
        }}
      />
      <EngageStack.Screen
        name={routes.TRANCHE_ITEM}
        component={TrancheItemScreen}
        options={{
          headerTitle: () => <NavigationTitle title="Engagement tranche" />,
        }}
      />
      <EngageStack.Screen
        name={routes.ENGAGEMENT_VOTANTS}
        component={EngagementVotantScreen}
        options={{
          headerTitle: () => <NavigationTitle title="Votants" />,
        }}
      />
    </EngageStack.Navigator>
  );
}
