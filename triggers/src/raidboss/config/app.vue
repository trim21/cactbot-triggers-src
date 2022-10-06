<template>
  <div class='container'>
    <div class='row'>
      <div class='col-3'>
        <h1>职业排序</h1>
        <draggable
          tag='ul' class='list-group'
          v-model='jobOrder'
          group='people'
          item-key='id'>
          <template #item='{element}'>
            <li class='list-group-item' :class='jobIDToClass(element.id)'>{{ element.name }}</li>
          </template>
        </draggable>
      </div>
      <div class='col-9'>
        <div class='row'>
          <h1>选项</h1>
        </div>
        <div class='row'>
          <div class='form-check'>
            <input class='form-check-input' type='checkbox' v-model='enablePostNamazu' id='flexCheckDefault'>
            <label class='form-check-label' for='flexCheckDefault'> 启用鲶鱼精 </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import draggable from 'vuedraggable';

import util from 'cactbot/resources/util';

import { defaultConfig, loadConfig } from './config';
import { nameToJobEnum } from '../job';


type vueJobData = {
  id: string;
  order: number;
  name: string;
}

type Data = {
  enablePostNamazu: boolean;
  jobOrder: vueJobData[];
}

export default defineComponent({
  components: {
    draggable,
  },
  data(): Data {
    console.log('app init');
    const c = defaultConfig();
    return {
      enablePostNamazu: c.enablePostNamazu,
      jobOrder: jobConfigToVueJobData(c.jobOrder),
    };
  },
  created() {
    const that = this;
    loadConfig().then(c => {
      that.jobOrder = jobConfigToVueJobData(c.jobOrder);
      that.enablePostNamazu = c.enablePostNamazu;
    });
  },
  watch: {
    enablePostNamazu() {
      configChange(this.$data);
    },
    jobOrder() {
      configChange(this.$data);
    },
  },
  methods: {
    jobIDToClass(job: string) {
      const id = util.jobEnumToJob(parseInt(job));

      if (util.isTankJob(id)) {
        return ['list-group-item-primary'];
      }

      if (util.isHealerJob(id)) {
        return ['list-group-item-success'];
      }

      if (util.isDpsJob(id)) {
        return ['list-group-item-danger'];
      }

      return [];
    },
  },
});

function jobConfigToVueJobData(jobOrder: Record<string, number>): vueJobData[] {
  return Object.entries(jobOrder)
    .map(([id, order]) => ({ id, order, name: nameToJobEnum[id] }))
    .sort((a, b) => a.order - b.order);
}

function VueJobDataToJobConfig(jobOrder: vueJobData[]): Record<string, number> {
  return Object.fromEntries(jobOrder.map(x => [x.id, x.order]));
}

async function configChange(data: Data) {
  await callOverlayHandler({
    call: 'saveData', key: 'trim21-triggers-config', data: {
      ...data,
      jobOrder: VueJobDataToJobConfig(data.jobOrder),
    },
  });
  await callOverlayHandler({ call: 'cactbotReloadOverlays' });
  console.log('data change', JSON.stringify(data));
}
</script>

