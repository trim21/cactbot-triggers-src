<template>
  <div class='container' v-if='loaded'>
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

import { overlayPluginKey, defaultConfig, loadConfigFromOverlayPlugin, sortByJobID } from './index';
import { nameToJobEnum } from '../job';


type vueJobData = {
  id: string;
  name: string;
}

type Data = {
  loaded: boolean,
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
      loaded: false,
      enablePostNamazu: c.enablePostNamazu,
      jobOrder: jobConfigToVueJobData(c.jobOrder),
    };
  },
  created() {
    loadConfigFromOverlayPlugin().then(c => {
      [{ jobID: 1 }, { jobID: 2 }].sort(sortByJobID);
      this.jobOrder = jobConfigToVueJobData(c.jobOrder);
      this.enablePostNamazu = c.enablePostNamazu;
      this.loaded = true;
    });
  },
  watch: {
    enablePostNamazu() {
      if (this.loaded) {
        configChange(this.$data);
      }
    },
    jobOrder() {
      if (this.loaded) {
        configChange(this.$data);
      }
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

console.log(jobConfigToVueJobData(defaultConfig().jobOrder));

function VueJobDataToJobConfig(jobOrder: vueJobData[]): Record<string, number> {
  return Object.fromEntries(jobOrder.map((x, i) => [x.id, i]));
}

async function configChange(v: Data) {
  const data = JSON.parse(JSON.stringify(v));
  data.jobOrder = VueJobDataToJobConfig(data.jobOrder);

  await callOverlayHandler({ call: 'saveData', key: overlayPluginKey, data });
  await callOverlayHandler({ call: 'cactbotReloadOverlays' });
  console.log('data change', JSON.stringify(data));
}

</script>

