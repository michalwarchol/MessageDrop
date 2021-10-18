import { Form, Formik } from "formik";
import React from "react";
import { useGetSuggestedChatRoomsQuery } from "../../generated/graphql";
import InputField from "../InputField/InputField";
import SuggestedChatRoom from "../SuggestedChatRoom/SuggestedChatRoom";
import styles from "./ExploreContent.module.scss";

const ExploreContent: React.FC = () => {
  const { data } = useGetSuggestedChatRoomsQuery();

  return (
    <div className={styles.exploreContent}>
      <div className={styles.search}>
        <Formik
          initialValues={{ search: "" }}
          onSubmit={() => {
            console.log("search");
          }}
        >
          <Form>
            <div className={styles.formik}>
              <InputField
                name="search"
                placeholder="search chat rooms and users"
              />
            </div>
          </Form>
        </Formik>
      </div>

      <div className={styles.suggestedChats}>
        {data &&
          data.getSuggestedChatRooms.map((elem, index) => (
            <SuggestedChatRoom chatRoomWithImage={elem} key={index} />
          ))}
      </div>
    </div>
  );
};
export default ExploreContent;
