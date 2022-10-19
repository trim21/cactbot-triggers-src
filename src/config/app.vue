<template>
  <div class="container" v-if="loaded">
    <div class="row">
      <div class="col-3">
        <h1>职业排序</h1>
        <draggable tag="ul" class="list-group" v-bind="dragOptions" v-model="jobOrder" group="people" item-key="id">
          <template #item="{ element }">
            <li class="list-group-item" :class="jobIDToClass(element.id)">{{ element.name }}</li>
          </template>
        </draggable>
      </div>
      <div class="col-9">
        <div class="row">
          <h1>选项</h1>
        </div>
        <div class="row">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" v-model="config.enablePostNamazu" id="flexCheckDefault" />
            <label class="form-check-label" for="flexCheckDefault"> 启用鲶鱼精 </label>
          </div>
        </div>
        <div class="row">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" v-model="config.partyNotification" id="partyNotification" />
            <label class="form-check-label" for="partyNotification"> 启用队内指挥 </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import util from '@trim21/cactbot/resources/util';
import { defineComponent } from 'vue';
import draggable from 'vuedraggable';

import type { Config } from './config';
import { overlayPluginKey, defaultConfig, loadRawConfigFromOverlayPlugin, sortByJobID, StoreConfig } from './config';
import { jobIDToCN } from './job';

type vueJobData = {
  id: string;
  name: string;
};

type VueData = {
  loaded: boolean;
  config: Config;
  jobOrder: vueJobData[];
};

export default defineComponent({
  components: {
    draggable,
  },
  data(): VueData {
    console.log('app init');
    const c = defaultConfig();
    return {
      loaded: false,
      config: c,
      jobOrder: jobConfigToVueJobData(c.jobOrder),
    };
  },
  created() {
    loadRawConfigFromOverlayPlugin().then((raw) => {
      console.log(raw);
      const c = JSON.parse(raw) as Config;

      [{ jobID: 1 }, { jobID: 2 }].sort(sortByJobID);
      this.jobOrder = jobConfigToVueJobData(c.jobOrder);
      this.config = c;
      setTimeout(() => {
        this.loaded = true;
      }, 100);
    });
  },
  watch: {
    config: {
      handler() {
        if (this.loaded) {
          configChange(this.$data);
        }
      },
      deep: true,
    },
    jobOrder() {
      if (this.loaded) {
        configChange(this.$data);
      }
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 250,
        group: 'people',
        disabled: false,
        ghostClass: 'ghost',
      };
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
    .map(([id, order]) => ({ id, order, name: jobIDToCN[id] }))
    .sort((a, b) => a.order - b.order);
}

console.log(jobConfigToVueJobData(defaultConfig().jobOrder));

function VueJobDataToJobConfig(jobOrder: vueJobData[]): Record<string, number> {
  return Object.fromEntries(jobOrder.map((x, i) => [x.id, i]));
}

async function configChange(v: VueData) {
  const data = JSON.parse(JSON.stringify(v.config));
  data.jobOrder = VueJobDataToJobConfig(v.jobOrder);

  await StoreConfig(data);
}
</script>
