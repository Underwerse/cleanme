import {colorSchema} from './variables';
import {StyleSheet} from 'react-native';

const Styles = StyleSheet.create({
  container: {
    backgroundColor: colorSchema.bgrColor,
    paddingBottom: 50,
    paddingLeft: 20,
    paddingRight: 20,
  },
  listItemContainer: {
    marginBottom: 5,
    marginRight: -20,
  },
  listDescription: {
    alignSelf: 'flex-start',
    width: '70%',
    flexGrow: 3,
  },
  listPrice: {
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: -20,
  },
  header: {
    height: '15%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: colorSchema.bgrColor,
  },
  titleMain: {
    fontSize: 26,
    fontFamily: 'sans-serif',
    backgroundColor: colorSchema.bgrColor,
    paddingBottom: 20,
    marginBottom: 0,
  },
  text: {
    fontSize: 20,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: -10,
    marginRight: -10,
  },
  singleTextDetailsTitle: {
    color: colorSchema.primaryTextColor,
    fontSize: 20,
    fontWeight: 'bold',
  },
  singleTextDetailsValue: {
    fontSize: 20,
    color: colorSchema.mainColor,
  },
  dateInput: {
    fontSize: 20,
    marginBottom: 20,
    marginLeft: 10,
  },
  searchInput: {
    backgroundColor: colorSchema.bgrColor,
    width: '100%',
    alignSelf: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
  },
  deadlineWrap: {
    flexDirection: 'row',
  },
  btnBase: {
    marginBottom: 20,
    backgroundColor: colorSchema.mainColor,
    borderRadius: 40,
  },
  btnAddTask: {
    position: 'absolute',
    bottom: 20,
    left: '42%',
  },
  btnEmptyTitle: {
    color: colorSchema.mainColor,
  },
  btnEmptyContainer: {
    marginHorizontal: 50,
    marginTop: -10,
    marginBottom: 20,
  },
  btnGreen: {
    marginTop: 20,
    marginBottom: 50,
    backgroundColor: colorSchema.green,
    borderRadius: 40,
  },
  btnSendComment: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
  like: {
    position: 'absolute',
    top: 110,
    right: 20,
  },
  likeQty: {
    position: 'absolute',
    top: 80,
    right: 30,
  },
  textItem: {
    fontSize: 20,
    marginTop: -15,
    marginLeft: -10,
    marginRight: -10,
  },
  commentIcon: {
    fontSize: 20,
    marginTop: -15,
    marginLeft: -10,
    marginRight: -10,
  },
  image: {
    marginTop: 30,
    marginBottom: 30,
  },
  creatorAvatar: {
    position: 'absolute',
    top: 50,
    right: -40,
  },
});

export default Styles;
