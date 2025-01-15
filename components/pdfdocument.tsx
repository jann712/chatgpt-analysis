import { Document, Page, Text, StyleSheet, View } from "@react-pdf/renderer";
import { messageObject } from "@/app/api/types";
import { v4 as uuid } from "uuid";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
  },
  section: {
    // margin: 10,
    // padding: 10,
    // flexGrow: 1,
    marginVertical: 20
  },
  view: {
    marginVertical: 10,
    fontSize: 12,
    marginHorizontal: 30,
  },
  title: {
    textAlign: "center",
    fontWeight: 700,
    fontSize: 20,
    marginVertical: 20,
  },
  subtitle: {
    fontWeight: 200,
    fontSize: 10,
    textAlign: "center",
  },
});

export function PDFDocument({ objectArray }: { objectArray: messageObject[] }) {
    const totalNumberMessages = objectArray.reduce((total, item) => total + item.numberMessages, 0)
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Exportação de dados ChatGPT</Text>
          <Text style={styles.subtitle}>
            Número de conversas: {objectArray.length}
          </Text>
          <Text style={styles.subtitle}>Número total de perguntas: {totalNumberMessages}</Text>
        </View>
        {objectArray.map((object) => {
          return (
            <View style={styles.view} key={uuid()}>
              <div className="flex flex-col">
                <Text>Título do chat: {object.title}</Text>
                <Text>Número de perguntas: {object.numberMessages}</Text>
                <Text>Última atualização: {object.updateTime}</Text>
              </div>
            </View>
          );
        })}
      </Page>
    </Document>
  );
}
